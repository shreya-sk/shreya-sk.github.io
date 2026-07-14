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

if [ -n "$(git status --porcelain -- obsidian)" ]; then
  git add obsidian
  git commit -m "vault sync: $(date '+%Y-%m-%d %H:%M')"
  git push
  echo "✔ Pushed vault changes — site will redeploy."
else
  echo "✔ Already in sync — nothing to push."
fi
