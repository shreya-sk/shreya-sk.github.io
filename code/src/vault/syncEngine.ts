// Sync engine: clone / pull / push with 'ours' conflict resolution and an
// autonomous 10-minute pull loop.
//
// Model (mirrors git plumbing, executed via GitHub's CORS-enabled Git Data API):
//   clone  = fetch ref → commit → recursive tree; blobs load lazily on open
//   pull   = compare remote head; three-way diff per file against last-synced
//            sha; dirty-local + changed-remote ⇒ conflict ⇒ keep local buffer
//            (ours), log it, notify UI
//   push   = createBlob per dirty file → createTree(base: remote tree)
//            → createCommit(parent: remote head) → updateRef (fast-forward)

import { GitHubGitClient, GitHubError } from './githubClient';
import * as vfs from './vaultFs';
import { VaultSettings, VaultMeta, ConflictEntry, SyncState, SyncStatus } from './types';

export interface PullResult {
  changed: string[];
  conflicts: ConflictEntry[];
  upToDate: boolean;
}

type Listener = (state: SyncState) => void;
type ConflictListener = (conflicts: ConflictEntry[]) => void;
type TreeListener = (meta: VaultMeta) => void;

const AUTO_SYNC_MS = 10 * 60 * 1000;

export class VaultSyncEngine {
  private client: GitHubGitClient;
  private meta: VaultMeta | null = null;
  private state: SyncState = { status: 'idle' };
  private listeners = new Set<Listener>();
  private conflictListeners = new Set<ConflictListener>();
  private treeListeners = new Set<TreeListener>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private busy = false;

  constructor(private settings: VaultSettings) {
    this.client = new GitHubGitClient(settings);
  }

  // ---------- events ----------

  onState(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }
  onConflicts(fn: ConflictListener): () => void {
    this.conflictListeners.add(fn);
    return () => this.conflictListeners.delete(fn);
  }
  onTree(fn: TreeListener): () => void {
    this.treeListeners.add(fn);
    if (this.meta) fn(this.meta);
    return () => this.treeListeners.delete(fn);
  }

  private setState(status: SyncStatus, detail?: string, error?: string) {
    this.state = { status, detail, error, lastSync: this.meta?.lastSync };
    this.listeners.forEach((fn) => fn(this.state));
  }
  private emitTree() {
    if (this.meta) this.treeListeners.forEach((fn) => fn(this.meta!));
  }

  getMeta(): VaultMeta | null {
    return this.meta;
  }

  // ---------- clone / init ----------

  private get repoKey(): string {
    const s = this.settings;
    return `${s.owner}/${s.repo}#${s.branch}/${s.basePath}`;
  }

  /** Load cached meta from LightningFS, or perform an initial clone. */
  async init(): Promise<void> {
    this.meta = await vfs.readMeta();
    if (this.meta && this.meta.repoKey !== this.repoKey) {
      // Settings point at a different repo than the cache — start clean.
      await vfs.wipe();
      this.meta = null;
    }
    if (this.meta) {
      this.emitTree();
      // refresh in background
      this.pull().catch(() => undefined);
    } else {
      await this.clone();
    }
  }

  async clone(): Promise<void> {
    this.setState('fetching', 'Cloning vault into browser storage…');
    try {
      const headSha = await this.client.getHead();
      const treeSha = await this.client.getCommitTree(headSha);
      const entries = await this.client.getTree(treeSha);
      const files: VaultMeta['files'] = {};
      for (const e of entries) files[e.path] = { sha: e.sha, dirty: false };
      this.meta = { headSha, treeSha, files, lastSync: Date.now(), repoKey: this.repoKey };
      await vfs.writeMeta(this.meta);
      this.emitTree();
      this.setState('idle', `Cloned ${entries.length} files`);
    } catch (err) {
      this.setState('error', undefined, (err as Error).message);
      throw err;
    }
  }

  // ---------- file ops ----------

  /** Read a file: local buffer if edited/cached, otherwise fetch the blob. */
  async openFile(path: string): Promise<string> {
    if (!this.meta) throw new Error('Vault not initialised');
    const meta = this.meta.files[path];
    if (!meta) throw new Error(`Unknown file: ${path}`);

    const cached = await vfs.readCached(path);
    if (cached !== null && (meta.dirty || meta.sha === '')) return cached;
    if (cached !== null) return cached; // clean cache is invalidated on pull

    this.setState('fetching', `Loading ${path}`);
    try {
      const content = await this.client.getBlob(meta.sha);
      await vfs.writeCached(path, content);
      this.setState('idle');
      return content;
    } catch (err) {
      this.setState('error', undefined, (err as Error).message);
      throw err;
    }
  }

  /** Persist an edit to the browser FS and mark the file dirty. */
  async saveFile(path: string, content: string): Promise<void> {
    if (!this.meta) return;
    await vfs.writeCached(path, content);
    const meta = this.meta.files[path];
    if (meta) meta.dirty = true;
    else this.meta.files[path] = { sha: '', dirty: true };
    await vfs.writeMeta(this.meta);
    this.emitTree();
  }

  async createFile(path: string, content = ''): Promise<void> {
    if (!this.meta) throw new Error('Vault not initialised');
    if (this.meta.files[path] && !this.meta.files[path].deleted) {
      throw new Error(`${path} already exists`);
    }
    this.meta.files[path] = { sha: '', dirty: true };
    await vfs.writeCached(path, content);
    await vfs.writeMeta(this.meta);
    this.emitTree();
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.meta) return;
    const meta = this.meta.files[path];
    if (!meta) return;
    if (meta.sha === '') delete this.meta.files[path]; // never pushed
    else {
      meta.deleted = true;
      meta.dirty = true;
    }
    await vfs.removeCached(path);
    await vfs.writeMeta(this.meta);
    this.emitTree();
  }

  dirtyPaths(): string[] {
    if (!this.meta) return [];
    return Object.entries(this.meta.files)
      .filter(([, m]) => m.dirty)
      .map(([p]) => p);
  }

  // ---------- pull ----------

  async pull(): Promise<PullResult> {
    if (!this.meta) throw new Error('Vault not initialised');
    if (this.busy) return { changed: [], conflicts: [], upToDate: true };
    this.busy = true;
    this.setState('fetching', 'Checking remote…');

    try {
      const remoteHead = await this.client.getHead();
      if (remoteHead === this.meta.headSha) {
        this.meta.lastSync = Date.now();
        await vfs.writeMeta(this.meta);
        this.setState('idle', 'Already up to date');
        return { changed: [], conflicts: [], upToDate: true };
      }

      this.setState('pulling', 'Fetching remote changes…');
      const remoteTreeSha = await this.client.getCommitTree(remoteHead);
      const remoteEntries = await this.client.getTree(remoteTreeSha);
      const remote = new Map(remoteEntries.map((e) => [e.path, e.sha]));

      this.setState('merging', 'Merging…');
      const changed: string[] = [];
      const conflicts: ConflictEntry[] = [];

      // Remote-side adds & updates
      for (const [path, remoteSha] of remote) {
        const local = this.meta.files[path];
        if (!local) {
          // new remote file
          this.meta.files[path] = { sha: remoteSha, dirty: false };
          changed.push(path);
        } else if (local.sha !== remoteSha) {
          if (local.dirty) {
            // CONFLICT — 'ours': keep the active browser buffer, log it,
            // stamp an inline alert into the note.
            const entry: ConflictEntry = {
              path,
              at: Date.now(),
              remoteSha,
              resolution: 'kept-local',
            };
            conflicts.push(entry);
            const buf = await vfs.readCached(path);
            if (buf !== null && !buf.startsWith('> [!warning] Sync conflict')) {
              const stamp =
                `> [!warning] Sync conflict — ${new Date().toISOString()}\n` +
                `> This note changed on the remote while you were editing. ` +
                `Your browser version was kept (ours). Remote blob: ${remoteSha.slice(0, 7)}\n\n`;
              await vfs.writeCached(path, stamp + buf);
            }
            // base advances so our next push overwrites remote (ours)
            local.sha = remoteSha;
          } else {
            local.sha = remoteSha;
            await vfs.removeCached(path); // invalidate stale cache
            changed.push(path);
          }
        }
      }

      // Remote-side deletions
      for (const path of Object.keys(this.meta.files)) {
        const local = this.meta.files[path];
        if (!remote.has(path) && local.sha !== '' && !local.deleted) {
          if (local.dirty) {
            conflicts.push({
              path,
              at: Date.now(),
              remoteSha: '(deleted on remote)',
              resolution: 'kept-local',
            });
            local.sha = ''; // re-add on next push
          } else {
            delete this.meta.files[path];
            await vfs.removeCached(path);
            changed.push(path);
          }
        }
      }

      this.meta.headSha = remoteHead;
      this.meta.treeSha = remoteTreeSha;
      this.meta.lastSync = Date.now();
      await vfs.writeMeta(this.meta);

      if (conflicts.length) {
        await vfs.appendConflicts(conflicts);
        this.conflictListeners.forEach((fn) => fn(conflicts));
      }
      this.emitTree();
      this.setState('idle', `Pulled ${changed.length} changes`);
      return { changed, conflicts, upToDate: false };
    } catch (err) {
      this.setState('error', undefined, (err as Error).message);
      throw err;
    } finally {
      this.busy = false;
    }
  }

  // ---------- push ----------

  async push(message: string): Promise<void> {
    if (!this.meta) throw new Error('Vault not initialised');
    const dirty = this.dirtyPaths();
    if (!dirty.length) return;

    // Integrate remote first so we commit on top of the latest head.
    await this.pull();

    this.busy = true;
    this.setState('pushing', `Committing ${dirty.length} file(s)…`);
    try {
      const changes: Array<{ path: string; sha: string | null }> = [];
      for (const path of dirty) {
        const fm = this.meta.files[path];
        if (fm.deleted) {
          changes.push({ path, sha: null });
        } else {
          const content = (await vfs.readCached(path)) ?? '';
          changes.push({ path, sha: await this.client.createBlob(content) });
        }
      }

      const newTree = await this.client.createTree(this.meta.treeSha, changes);
      const newCommit = await this.client.createCommit(
        message || `vault: update ${dirty.length} file(s) from browser`,
        newTree,
        [this.meta.headSha]
      );

      try {
        await this.client.updateRef(newCommit);
      } catch (err) {
        if (err instanceof GitHubError && (err.status === 422 || err.status === 409)) {
          // Race: remote moved between pull and push. Pull + retry once.
          this.busy = false;
          await this.pull();
          this.busy = true;
          const retryTree = await this.client.createTree(this.meta.treeSha, changes);
          const retryCommit = await this.client.createCommit(message, retryTree, [
            this.meta.headSha,
          ]);
          await this.client.updateRef(retryCommit);
          this.meta.headSha = retryCommit;
          this.meta.treeSha = retryTree;
        } else throw err;
      }

      if (this.meta.headSha !== newCommit && this.meta.treeSha) {
        // normal path (no retry): record the new head
      }
      // Refresh head/tree + per-file shas from remote truth
      const head = await this.client.getHead();
      const treeSha = await this.client.getCommitTree(head);
      const entries = await this.client.getTree(treeSha);
      const remote = new Map(entries.map((e) => [e.path, e.sha]));
      for (const path of dirty) {
        const fm = this.meta.files[path];
        if (fm?.deleted) delete this.meta.files[path];
        else if (fm) {
          fm.dirty = false;
          fm.sha = remote.get(path) ?? fm.sha;
        }
      }
      this.meta.headSha = head;
      this.meta.treeSha = treeSha;
      this.meta.lastSync = Date.now();
      await vfs.writeMeta(this.meta);
      this.emitTree();
      this.setState('idle', 'Pushed ✓');
    } catch (err) {
      this.setState('error', undefined, (err as Error).message);
      throw err;
    } finally {
      this.busy = false;
    }
  }

  // ---------- autonomous sync loop ----------

  startAutoSync(intervalMs: number = AUTO_SYNC_MS): void {
    this.stopAutoSync();
    this.timer = setInterval(() => {
      this.pull().catch(() => undefined);
    }, intervalMs);
  }

  stopAutoSync(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
