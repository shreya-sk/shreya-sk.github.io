#!/bin/bash
# Two-way sync: "Shreya's Life" (local Obsidian vault, iCloud)  ⇄  obsidian/ in shreya-sk.github.io
#
# PUBLISHED  : Learning/* ONLY — mapped to the site root (Learning/DevOps → DevOps)
# PRIVATE    : everything else — Journal/, Books/, Notes/, Attachments/,
#              Templates/, Work/, Welcome*.md, and any future top-level folder.
#              Nothing outside Learning/ ever leaves the vault.
# REPO-ONLY  : Daily - TIL/, Hey, there!.md, test-note.md — never enter the vault
#
# Also generates obsidian/recent.json — the most recently modified notes,
# which the homepage "currently on" section renders.
#
# Newer file wins in both directions. Deletions do NOT propagate (safety).
#
# Usage:
#   bash scripts/sync-vault.sh                  # run one sync now
#   bash scripts/sync-vault.sh --install-agent  # auto-sync every 10 min (launchd)

set -euo pipefail

VAULT="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Shreya's Life"
REPO="$HOME/Desktop/shreya-sk.github.io"
DEST="$REPO/obsidian"

COMMON=(--exclude '.obsidian/' --exclude '.trash/' --exclude '.DS_Store'
        --exclude '.git/' --exclude '.claude/' --exclude '*.excalidraw.md'
        --exclude 'Excalidraw*/' --exclude '.md'
        --exclude 'Learning/'   # guards against the nested Learning/Learning duplicate
        --exclude 'DKT.md' --exclude '*.py')  # personal notes / scripts stay private

REPO_ONLY=(--exclude 'Daily - TIL/' --exclude 'Hey, there!.md' --exclude 'test-note.md' --exclude 'recent.json')

# ---- optional: install a launchd agent that runs this every 10 minutes ----
if [[ "${1:-}" == "--install-agent" ]]; then
  PLIST="$HOME/Library/LaunchAgents/com.shreya.vaultsync.plist"
  mkdir -p "$HOME/Library/LaunchAgents"
  cat > "$PLIST" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.shreya.vaultsync</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$REPO/scripts/sync-vault.sh</string>
  </array>
  <key>StartInterval</key><integer>600</integer>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>/tmp/vaultsync.log</string>
  <key>StandardErrorPath</key><string>/tmp/vaultsync.log</string>
</dict>
</plist>
EOF
  launchctl unload "$PLIST" 2>/dev/null || true
  launchctl load "$PLIST"
  echo "✔ Installed. Vault syncs every 10 minutes (log: /tmp/vaultsync.log)"
  echo "  To stop: launchctl unload $PLIST"
  exit 0
fi

# ---- one sync pass ----
[ -d "$VAULT/Learning" ] || { echo "✖ Vault Learning folder not found: $VAULT/Learning"; exit 1; }
cd "$REPO"

echo "⇣ Pulling latest from GitHub…"
git pull --rebase --autostash
mkdir -p "$DEST"

echo "⇄ vault Learning → site…"
rsync -au "${COMMON[@]}" "$VAULT/Learning/" "$DEST/"

echo "⇄ site → vault Learning…"
rsync -au "${COMMON[@]}" "${REPO_ONLY[@]}" "$DEST/" "$VAULT/Learning/"

echo "🖼  Publishing images referenced by published notes → public/attachments/…"
python3 - "$DEST" "$VAULT" "$REPO/public/attachments" << 'PY'
import os, re, shutil, sys

dest, vault, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
IMG_EXT = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'}

# 1. Collect image filenames referenced by published notes: ![[...]]
refs = set()
for root, dirs, names in os.walk(dest):
    if 'Daily - TIL' in root:
        continue
    for n in names:
        if not n.endswith('.md'):
            continue
        with open(os.path.join(root, n), encoding='utf-8', errors='ignore') as f:
            for m in re.finditer(r'!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]', f.read()):
                fn = os.path.basename(m.group(1).strip())
                if os.path.splitext(fn)[1].lower() in IMG_EXT:
                    refs.add(fn)

# 2. Index every image in the vault (Attachments/, Learning/, anywhere)
index = {}
for root, dirs, names in os.walk(vault):
    if '.obsidian' in root or '.trash' in root:
        continue
    for n in names:
        if os.path.splitext(n)[1].lower() in IMG_EXT:
            index.setdefault(n, os.path.join(root, n))

# 3. Copy only referenced images, flat, newer-wins
os.makedirs(outdir, exist_ok=True)
copied = missing = 0
for fn in sorted(refs):
    src = index.get(fn)
    if not src:
        missing += 1
        continue
    dst = os.path.join(outdir, fn)
    if not os.path.exists(dst) or os.path.getmtime(src) > os.path.getmtime(dst):
        shutil.copy2(src, dst)
        copied += 1
print(f"   {len(refs)} referenced · {copied} copied · {missing} not found in vault")
PY

echo "🗂  Building recent.json (for the homepage 'currently on' section)…"
python3 - "$DEST" << 'PY'
import json, os, sys

dest = sys.argv[1]
skip_dirs = {'Daily - TIL', '.claude'}
skip_files = {'Hey, there!.md', 'test-note.md'}
entries = []
for root, dirs, names in os.walk(dest):
    rel_root = os.path.relpath(root, dest)
    top = rel_root.split(os.sep)[0]
    if top in skip_dirs:
        dirs[:] = []
        continue
    for n in names:
        if not n.endswith('.md') or n.endswith('.excalidraw.md') or n == '.md':
            continue
        rel = os.path.normpath(os.path.join(rel_root, n)).lstrip('./')
        if rel in skip_files:
            continue
        entries.append((os.path.getmtime(os.path.join(root, n)), rel))

entries.sort(reverse=True)
with open(os.path.join(dest, 'recent.json'), 'w') as f:
    json.dump([p for _, p in entries[:8]], f, indent=2)
print(f"   {min(len(entries), 8)} recent notes recorded")
PY

if [ -n "$(git status --porcelain -- obsidian public/attachments)" ]; then
  git add obsidian public/attachments
  git commit -m "vault sync: $(date '+%Y-%m-%d %H:%M')"
  git push
  echo "✔ Pushed vault changes — site will redeploy."
else
  echo "✔ Already in sync — nothing to push."
fi
