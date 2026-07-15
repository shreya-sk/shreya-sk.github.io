// Pure client-side Git operations via GitHub's Git Data API.
//
// Why not raw isomorphic-git clone? github.com's smart-HTTP git endpoints do
// not send CORS headers, so a browser clone requires routing your PAT through
// a third-party CORS proxy. The Git Data API (refs/trees/blobs/commits) is
// CORS-enabled, so this client implements the same git plumbing —
// blob → tree → commit → ref update - with the PAT never leaving
// browser → api.github.com.

import { VaultSettings, TreeEntry } from './types';

const API = 'https://api.github.com';

export class GitHubError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ---------- base64 helpers (unicode-safe, chunked for large files) ----------

export function b64ToUtf8(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function utf8ToB64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

// ---------------------------------------------------------------------------

export class GitHubGitClient {
  constructor(private settings: VaultSettings) {}

  private get base(): string {
    return `${API}/repos/${this.settings.owner}/${this.settings.repo}`;
  }

  private async req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.settings.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({} as { message?: string }));
      throw new GitHubError(res.status, body.message || `GitHub API ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  /** Verify token + repo access. Returns default branch name. */
  async checkAccess(): Promise<string> {
    const repo = await this.req<{ default_branch: string }>('');
    return repo.default_branch;
  }

  /** Latest commit sha on the branch. */
  async getHead(): Promise<string> {
    const ref = await this.req<{ object: { sha: string } }>(
      `/git/ref/heads/${encodeURIComponent(this.settings.branch)}`
    );
    return ref.object.sha;
  }

  /** Root tree sha for a commit. */
  async getCommitTree(commitSha: string): Promise<string> {
    const c = await this.req<{ tree: { sha: string } }>(`/git/commits/${commitSha}`);
    return c.tree.sha;
  }

  /**
   * Full recursive tree, filtered to basePath and returned with
   * vault-relative paths.
   */
  async getTree(treeSha: string): Promise<TreeEntry[]> {
    const data = await this.req<{
      tree: Array<{ path: string; sha: string; type: string }>;
      truncated: boolean;
    }>(`/git/trees/${treeSha}?recursive=1`);

    const prefix = this.settings.basePath ? this.settings.basePath.replace(/\/$/, '') + '/' : '';
    return data.tree
      .filter((e) => e.type === 'blob' && (!prefix || e.path.startsWith(prefix)))
      .map((e) => ({
        path: prefix ? e.path.slice(prefix.length) : e.path,
        sha: e.sha,
        type: 'blob' as const,
      }));
  }

  /** Fetch blob content as UTF-8 text. */
  async getBlob(sha: string): Promise<string> {
    const blob = await this.req<{ content: string; encoding: string }>(`/git/blobs/${sha}`);
    if (blob.encoding !== 'base64') throw new Error(`Unexpected blob encoding: ${blob.encoding}`);
    return b64ToUtf8(blob.content);
  }

  /** Upload content, get a blob sha back. */
  async createBlob(content: string): Promise<string> {
    const blob = await this.req<{ sha: string }>('/git/blobs', {
      method: 'POST',
      body: JSON.stringify({ content: utf8ToB64(content), encoding: 'base64' }),
    });
    return blob.sha;
  }

  /**
   * Create a tree layered on baseTreeSha.
   * changes: vault-relative path → blob sha, or null to delete.
   */
  async createTree(
    baseTreeSha: string,
    changes: Array<{ path: string; sha: string | null }>
  ): Promise<string> {
    const prefix = this.settings.basePath ? this.settings.basePath.replace(/\/$/, '') + '/' : '';
    const tree = changes.map((c) => ({
      path: prefix + c.path,
      mode: '100644',
      type: 'blob',
      sha: c.sha, // null deletes the path
    }));
    const res = await this.req<{ sha: string }>('/git/trees', {
      method: 'POST',
      body: JSON.stringify({ base_tree: baseTreeSha, tree }),
    });
    return res.sha;
  }

  async createCommit(message: string, treeSha: string, parents: string[]): Promise<string> {
    const res = await this.req<{ sha: string }>('/git/commits', {
      method: 'POST',
      body: JSON.stringify({ message, tree: treeSha, parents }),
    });
    return res.sha;
  }

  /** Fast-forward the branch. Throws GitHubError(422) on non-fast-forward. */
  async updateRef(commitSha: string): Promise<void> {
    await this.req(`/git/refs/heads/${encodeURIComponent(this.settings.branch)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commitSha, force: false }),
    });
  }
}
