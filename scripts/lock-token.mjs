#!/usr/bin/env node
// One-time: encrypt your GitHub token + repo details with a password and
// write public/vault.lock.json. Commit & push it — then any device unlocks
// the editor with just the password.
//
// Usage:  npm run lock
//
// Uses the same crypto as the app: PBKDF2(SHA-256, 600k) → AES-256-GCM.

import { webcrypto as crypto } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITERATIONS = 600_000;
const b64 = (buf) => Buffer.from(buf).toString('base64');

// Works both interactively and with piped input
let ask;
let closeInput = () => {};
if (process.stdin.isTTY) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  ask = (q) => rl.question(q);
  closeInput = () => rl.close();
} else {
  const lines = (await new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
  })).split('\n');
  let i = 0;
  ask = (q) => {
    process.stdout.write(q + '\n');
    return Promise.resolve(lines[i++] ?? '');
  };
}

async function deriveKey(password, salt) {
  const material = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
}

console.log('\n🔐 Vault editor — create password lock\n');

const token = (await ask('GitHub token (github_pat_…): ')).trim();
const owner = (await ask('Repo owner   [shreya-sk]: ')).trim() || 'shreya-sk';
const repo = (await ask('Repo name    [obsidian-vault]: ')).trim() || 'obsidian-vault';
const branch = (await ask('Branch       [main]: ')).trim() || 'main';
const basePath = (await ask('Base path    [empty = repo root]: ')).trim();
const password = (await ask('\nChoose your unlock password (a phrase, not a word!): ')).trim();
const confirm = (await ask('Repeat password: ')).trim();
closeInput();

if (!token.startsWith('github_pat_') && !token.startsWith('ghp_')) {
  console.error('\n✖ That does not look like a GitHub token.');
  process.exit(1);
}
if (password !== confirm) {
  console.error('\n✖ Passwords do not match.');
  process.exit(1);
}
if (password.length < 10) {
  console.error('\n✖ Use at least 10 characters — this blob is public, the password is the only defence.');
  process.exit(1);
}

const settings = { token, owner, repo, branch, basePath };
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const key = await deriveKey(password, salt);
const ct = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  key,
  new TextEncoder().encode(JSON.stringify(settings))
);

const blob = { v: 1, salt: b64(salt), iv: b64(iv), ct: b64(ct) };
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, 'public', 'vault.lock.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(blob));

console.log(`\n✔ Wrote ${out}`);
console.log('\nNext:');
console.log('  git add public/vault.lock.json && git commit -m "vault lock" && git push');
console.log('\nAfter deploy, any device unlocks /editor with just your password.');
