# Browser Vault Editor (`/editor`)

A fully client-side SPA for reading and writing your Obsidian vault from any
browser — office, phone, anywhere — with changes flowing back into your local
Obsidian copy.

## How the sync loop works

```
 ┌─────────────────────┐        Git Data API         ┌──────────────┐
 │  Browser  /editor   │ ──── (blobs/trees/commits) ─▶│              │
 │  LightningFS cache  │ ◀─── auto-pull every 10 min ─│    GitHub    │
 └─────────────────────┘                              │ obsidian-    │
                                                      │ vault (repo) │
 ┌─────────────────────┐   Obsidian Git plugin        │              │
 │  Local Obsidian     │ ◀── pull/push every 10 min ─▶│              │
 │  (iCloud vault)     │                              └──────────────┘
 └─────────────────────┘
```

The browser editor performs real git plumbing (blob → tree → commit →
fast-forward ref update) through GitHub's CORS-enabled Git Data API. Your PAT
lives only in `localStorage` and is only ever sent to `api.github.com` — no
CORS proxy, no third party, no server.

Why not a literal `isomorphic-git` clone? github.com's git smart-HTTP
endpoints don't send CORS headers, so isomorphic-git in a browser requires
routing PAT-authenticated traffic through a proxy. The Git Data API gives the
same git semantics without that risk, and LightningFS still provides the
local browser filesystem sandbox.

## One-time setup

1. **Create a private repo** on GitHub named `obsidian-vault`.
2. **Make your local vault a git clone of it** — run once in Terminal:

   ```bash
   bash ~/Desktop/shreya-sk.github.io/scripts/setup-vault-git.sh
   ```

3. **Install the "Git" community plugin in Obsidian** (Settings → Community
   plugins → Browse → "Git"). Set backup + pull interval to 10 minutes. This
   is what back-syncs browser edits into your local copy.
4. **Create a fine-grained PAT**: GitHub → Settings → Developer settings →
   Fine-grained tokens. Scope it to *only* `obsidian-vault`, permission
   **Contents: Read and write**. Never use a classic all-repos token here.
5. **Create the password lock** (so you never touch the token again):

   ```bash
   npm run lock
   ```

   Paste the PAT once, choose an unlock password, then commit & push the
   generated `public/vault.lock.json`. From then on, `/editor` on **any
   device** asks only for your password — once per device.

   (Without a lock file, the editor falls back to asking for the PAT
   directly.)

## Using the editor

- **Left sidebar** — vault tree. Click to open, hover a folder for ➕ new
  note, amber dot = uncommitted edits.
- **Center** — CodeMirror 6 markdown editor. `[[wikilinks]]`, `![[embeds]]`
  and `> [!note]` callouts are highlighted live; Cmd/Ctrl-click a wikilink to
  follow it. Toggle **Preview** for rendered markdown.
- **Right panel** — Git sync dashboard: status (idle / fetching / pulling /
  merging / pushing), dirty file list, commit message, **Pull** and
  **Commit & Push**.
- Edits are saved to browser storage instantly (survive tab close); they hit
  GitHub only when you press **Commit & Push**.
- The app auto-pulls every 10 minutes.

## Conflict resolution

If a note changed on GitHub while you had unsaved browser edits, the merge
keeps **your browser version** (`ours` strategy), then:

1. stamps a `> [!warning] Sync conflict` callout inline at the top of the note,
2. records the event in the conflict log (right panel),
3. pops a modal telling you which notes were affected.

Your next push overwrites the remote version — the callout tells you which
remote blob was superseded if you ever need to recover it from git history.

## Deployment

No new pipeline needed — the existing `.github/workflows/deploy.yml` already
builds this repo with Vite and deploys `dist/` to GitHub Pages on every push
to `main`. The editor is code-split, so the blog's bundle size is unchanged.
