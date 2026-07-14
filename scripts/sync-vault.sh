#!/bin/bash
# Two-way sync: "Shreya's Life" (local Obsidian vault, iCloud)  ⇄  obsidian/ in shreya-sk.github.io
#
# PUBLISHED  : Learning/* (mapped to site root: Learning/DevOps → DevOps),
#              Notes/, Attachments/, root-level notes (Welcome.md, …)
# PRIVATE    : Journal/, Books/, Templates/, Work/  — never leave the vault
# REPO-ONLY  : Daily - TIL/, Hey, there!.md, test-note.md — never enter the vault
#
# Newer file wins in both directions. Deletions do NOT propagate (safety) —
# delete in both places if you really want something gone.
#
# Usage:
#   bash scripts/sync-vault.sh                  # run one sync now
#   bash scripts/sync-vault.sh --install-agent  # auto-sync every 10 min (launchd)

set -euo pipefail

VAULT="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Shreya's Life"
REPO="$HOME/Desktop/shreya-sk.github.io"
DEST="$REPO/obsidian"

# Junk that never syncs in either direction
COMMON=(--exclude '.obsidian/' --exclude '.trash/' --exclude '.DS_Store'
        --exclude '.git/' --exclude '*.excalidraw.md' --exclude 'Excalidraw*/'
        --exclude '.md')  # stray empty-named ".md" files

# Private vault folders — never published
PRIVATE=(--exclude 'Journal/' --exclude 'Books/' --exclude 'Templates/' --exclude 'Work/')

# Site-only content — never written into the vault
REPO_ONLY=(--exclude 'Daily - TIL/' --exclude 'Hey, there!.md' --exclude 'test-note.md')

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
[ -d "$VAULT" ] || { echo "✖ Vault not found: $VAULT"; exit 1; }
cd "$REPO"

echo "⇣ Pulling latest from GitHub…"
git pull --rebase --autostash
mkdir -p "$DEST"

echo "⇄ vault → site…"
# Learning/* lands at the site root (keeps current site layout)
[ -d "$VAULT/Learning" ] && rsync -au "${COMMON[@]}" "${PRIVATE[@]}" "$VAULT/Learning/" "$DEST/"
# Notes/ and Attachments/ sync as-is
for d in Notes Attachments; do
  [ -d "$VAULT/$d" ] && rsync -au "${COMMON[@]}" "$VAULT/$d/" "$DEST/$d/"
done
# Root-level notes (Welcome.md, …)
rsync -au "${COMMON[@]}" --include='/*.md' --exclude='*' "$VAULT/" "$DEST/"

echo "⇄ site → vault…"
# Notes/, Attachments/ back to vault root
for d in Notes Attachments; do
  [ -d "$DEST/$d" ] && rsync -au "${COMMON[@]}" "$DEST/$d/" "$VAULT/$d/"
done
# Root-level site notes back to vault root (minus site-only files)
rsync -au "${COMMON[@]}" "${REPO_ONLY[@]}" --include='/*.md' --exclude='*' "$DEST/" "$VAULT/"
# Everything else at the site root maps back into vault Learning/
mkdir -p "$VAULT/Learning"
rsync -au "${COMMON[@]}" "${REPO_ONLY[@]}" "${PRIVATE[@]}" \
  --exclude 'Notes/' --exclude 'Attachments/' --exclude '/*.md' \
  "$DEST/" "$VAULT/Learning/"

if [ -n "$(git status --porcelain -- obsidian)" ]; then
  git add obsidian
  git commit -m "vault sync: $(date '+%Y-%m-%d %H:%M')"
  git push
  echo "✔ Pushed vault changes — site will redeploy."
else
  echo "✔ Already in sync — nothing to push."
fi
