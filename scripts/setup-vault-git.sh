#!/bin/bash
# One-time setup: turn your local Obsidian vault (iCloud) into a git repo
# that syncs with GitHub — so browser edits at /editor flow back into
# your local Obsidian copy automatically.
#
# Usage:  bash setup-vault-git.sh
set -euo pipefail

VAULT_DIR="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Shreya's Life"
GITHUB_USER="shreya-sk"
REPO_NAME="obsidian-vault"   # create this as a PRIVATE repo on GitHub first

cd "$VAULT_DIR"

if [ -d .git ]; then
  echo "✔ Vault is already a git repo"
else
  git init -b main
  echo "✔ Initialised git repo"
fi

# Sensible ignores — Obsidian workspace state churns constantly and
# should never be synced (it causes pointless conflicts).
if [ ! -f .gitignore ]; then
  cat > .gitignore << 'EOF'
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/cache
.trash/
.DS_Store
EOF
  echo "✔ Wrote .gitignore"
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
  echo "✔ Added remote origin"
fi

git add -A
git commit -m "Initial vault import" || echo "✔ Nothing new to commit"
git push -u origin main

echo ""
echo "Done! Now install the 'Git' community plugin inside Obsidian"
echo "(Settings → Community plugins → Browse → 'Git') and enable:"
echo "  • Vault backup interval: 10 minutes"
echo "  • Auto pull interval:    10 minutes"
echo "  • Pull updates on startup: ON"
echo ""
echo "Your loop: browser /editor ⇄ GitHub ⇄ local Obsidian (via Git plugin)"
