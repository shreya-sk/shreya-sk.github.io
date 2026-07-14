#!/bin/bash
# Two-way sync: "Shreya's Life" (local Obsidian vault, iCloud)  ⇄  obsidian/ in shreya-sk.github.io
#
# What one run does:
#   1. git pull            — grab browser-editor commits from GitHub
#   2. repo  → vault       — newer notes from the site land in local Obsidian
#   3. vault → repo        — newer local notes land in the repo
#   4. commit + push       — site rebuilds with your local writing
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
EXCLUDES=(--exclude '.obsidian/' --exclude '.trash/' --exclude '.DS_Store' --exclude '.git/')

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

echo "⇄ Syncing (newer file wins)…"
rsync -au "${EXCLUDES[@]}" "$DEST/" "$VAULT/"   # site → local Obsidian
rsync -au "${EXCLUDES[@]}" "$VAULT/" "$DEST/"   # local Obsidian → site

if [ -n "$(git status --porcelain -- obsidian)" ]; then
  git add obsidian
  git commit -m "vault sync: $(date '+%Y-%m-%d %H:%M')"
  git push
  echo "✔ Pushed local vault changes — site will redeploy."
else
  echo "✔ Already in sync — nothing to push."
fi
