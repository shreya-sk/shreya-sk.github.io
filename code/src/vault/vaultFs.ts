// Local browser sandbox filesystem for the vault, backed by LightningFS
// (IndexedDB). Layout:
//   /files/<vault-relative-path>   cached + edited note content
//   /meta.json                     sync metadata (head sha, per-file state)
//   /conflicts.json                conflict resolution log

import LightningFS from '@isomorphic-git/lightning-fs';
import { VaultMeta, ConflictEntry } from './types';

const fs = new LightningFS('obsidian-vault-fs');
const P = fs.promises;

const FILES_ROOT = '/files';
const META = '/meta.json';
const CONFLICTS = '/conflicts.json';

async function mkdirp(dir: string): Promise<void> {
  const parts = dir.split('/').filter(Boolean);
  let cur = '';
  for (const part of parts) {
    cur += '/' + part;
    try {
      await P.mkdir(cur);
    } catch {
      /* exists */
    }
  }
}

function filePath(vaultPath: string): string {
  return `${FILES_ROOT}/${vaultPath}`;
}

export async function readCached(vaultPath: string): Promise<string | null> {
  try {
    return (await P.readFile(filePath(vaultPath), 'utf8')) as string;
  } catch {
    return null;
  }
}

export async function writeCached(vaultPath: string, content: string): Promise<void> {
  const full = filePath(vaultPath);
  await mkdirp(full.slice(0, full.lastIndexOf('/')));
  await P.writeFile(full, content, 'utf8');
}

export async function removeCached(vaultPath: string): Promise<void> {
  try {
    await P.unlink(filePath(vaultPath));
  } catch {
    /* not cached */
  }
}

export async function readMeta(): Promise<VaultMeta | null> {
  try {
    return JSON.parse((await P.readFile(META, 'utf8')) as string) as VaultMeta;
  } catch {
    return null;
  }
}

export async function writeMeta(meta: VaultMeta): Promise<void> {
  await P.writeFile(META, JSON.stringify(meta), 'utf8');
}

export async function readConflicts(): Promise<ConflictEntry[]> {
  try {
    return JSON.parse((await P.readFile(CONFLICTS, 'utf8')) as string) as ConflictEntry[];
  } catch {
    return [];
  }
}

export async function appendConflicts(entries: ConflictEntry[]): Promise<void> {
  const all = [...(await readConflicts()), ...entries];
  await P.writeFile(CONFLICTS, JSON.stringify(all), 'utf8');
}

/** Wipe everything (used when switching repos / logging out). */
export async function wipe(): Promise<void> {
  // LightningFS supports wipe via constructor option; easiest reliable reset:
  new LightningFS('obsidian-vault-fs', { wipe: true });
}
