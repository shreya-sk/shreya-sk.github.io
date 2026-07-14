import { VaultSettings } from './types';

const KEY = 'vault.settings.v1';

export const DEFAULT_SETTINGS: VaultSettings = {
  token: '',
  owner: 'shreya-sk',
  repo: 'obsidian-vault',
  branch: 'main',
  basePath: '',
};

export function loadSettings(): VaultSettings | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.token || !parsed.owner || !parsed.repo) return null;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return null;
  }
}

export function saveSettings(s: VaultSettings): void {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSettings(): void {
  localStorage.removeItem(KEY);
}
