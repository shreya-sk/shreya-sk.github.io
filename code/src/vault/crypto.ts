// Password-locked vault credentials.
//
// The full settings object (token + repo details) is AES-256-GCM encrypted
// with a key derived from your password via PBKDF2 (SHA-256, 600k iterations).
// The encrypted blob ships publicly with the site (public/vault.lock.json);
// only someone who knows the password can recover the token from it.

import { VaultSettings } from './types';

export interface LockBlob {
  v: 1;
  salt: string; // base64
  iv: string;   // base64
  ct: string;   // base64 ciphertext
}

const ITERATIONS = 600_000;

const b64 = (buf: ArrayBuffer | Uint8Array): string =>
  btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer)));

const unb64 = (s: string): Uint8Array =>
  Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSettings(settings: VaultSettings, password: string): Promise<LockBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(JSON.stringify(settings))
  );
  return { v: 1, salt: b64(salt), iv: b64(iv), ct: b64(ct) };
}

/** Throws on wrong password (AES-GCM authentication failure). */
export async function decryptSettings(blob: LockBlob, password: string): Promise<VaultSettings> {
  const key = await deriveKey(password, unb64(blob.salt));
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(blob.iv) as BufferSource },
    key,
    unb64(blob.ct) as BufferSource
  );
  return JSON.parse(new TextDecoder().decode(pt)) as VaultSettings;
}

/** Fetch the lock blob shipped with the site, if one exists. */
export async function fetchLockBlob(): Promise<LockBlob | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}vault.lock.json`, { cache: 'no-store' });
    if (!res.ok) return null;
    const blob = (await res.json()) as LockBlob;
    return blob && blob.v === 1 && blob.ct ? blob : null;
  } catch {
    return null;
  }
}
