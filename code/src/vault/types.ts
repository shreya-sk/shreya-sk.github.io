// Shared types for the browser vault editor

export interface VaultSettings {
  token: string;      // GitHub PAT — stored ONLY in localStorage
  owner: string;      // repo owner, e.g. "shreya-sk"
  repo: string;       // vault repo, e.g. "obsidian-vault"
  branch: string;     // e.g. "main"
  basePath: string;   // subfolder inside the repo holding the vault ("" = repo root)
}

export interface TreeEntry {
  path: string;       // path relative to basePath
  sha: string;        // git blob sha
  type: 'blob' | 'tree';
}

export interface FileMeta {
  sha: string;        // blob sha at last sync ('' for brand-new local files)
  dirty: boolean;     // has uncommitted local edits
  deleted?: boolean;  // locally deleted, pending push
}

export interface VaultMeta {
  headSha: string;                    // remote commit sha at last sync
  treeSha: string;                    // remote root tree sha at last sync
  files: Record<string, FileMeta>;    // keyed by vault-relative path
  lastSync: number;                   // epoch ms
}

export interface ConflictEntry {
  path: string;
  at: number;          // epoch ms
  remoteSha: string;   // the remote blob version that was overridden
  resolution: 'kept-local'; // ours strategy
}

export type SyncStatus =
  | 'idle'
  | 'fetching'
  | 'pulling'
  | 'merging'
  | 'pushing'
  | 'error';

export interface SyncState {
  status: SyncStatus;
  detail?: string;
  lastSync?: number;
  error?: string;
}
