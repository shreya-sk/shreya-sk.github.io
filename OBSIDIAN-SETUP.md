# 🌱 Obsidian to GitHub Pages - Complete Setup Guide

This guide will help you sync your local Obsidian vault to GitHub so your blog automatically displays your notes.

## 📂 Where to Add Your Blog Posts

Your blog posts are simply **markdown files in your Obsidian vault**! The website automatically:
- Reads all `.md` files from your vault
- Organizes them by folder
- Displays them beautifully on your website

### Folder Structure Example:

```
my-obsidian-vault/
├── Blog Posts/
│   ├── my-first-post.md
│   ├── thoughts-on-life.md
│   └── learning-react.md
├── Today I Learned/
│   ├── python-tips.md
│   └── git-shortcuts.md
├── Projects/
│   └── website-redesign.md
└── Personal/
    └── reflections.md
```

Each folder becomes a **category** on your website automatically!

## 🚀 Step-by-Step: Connect Your Obsidian Vault

### Option 1: Create a New Repository for Your Vault (Recommended)

**Step 1: Create a New GitHub Repository**

1. Go to https://github.com/new
2. Repository name: `my-knowledge-vault` (or any name you like)
3. Make it **Public** (so the website can read it without authentication)
4. ✅ Check "Add a README file"
5. Click **Create repository**

**Step 2: Clone It to Your Computer**

Open Terminal/Command Prompt and run:

```bash
# Navigate to where you want your vault
cd ~/Documents

# Clone the repository
git clone https://github.com/YOUR-USERNAME/my-knowledge-vault.git

# This creates a folder called "my-knowledge-vault"
```

**Step 3: Open This Folder as an Obsidian Vault**

1. Open Obsidian
2. Click "Open folder as vault"
3. Select the `my-knowledge-vault` folder you just cloned
4. Start writing! ✍️

**Step 4: Set Up Auto-Sync with Obsidian Git Plugin**

1. In Obsidian, go to **Settings** → **Community plugins**
2. Turn off "Safe mode"
3. Click **Browse** → Search for **"Obsidian Git"**
4. Install and Enable it
5. Configure the plugin:
   - **Vault backup interval**: 10 minutes (auto-commit every 10 min)
   - **Auto pull interval**: 10 minutes (check for changes)
   - **Commit message**: "vault backup: {{date}}"

Now your vault will automatically sync to GitHub every 10 minutes! 🎉

**Step 5: Update Your Website Configuration**

Open `src/services/githubService.ts` and update:

```typescript
const GITHUB_OWNER = 'YOUR-USERNAME';        // Your GitHub username
const GITHUB_REPO = 'my-knowledge-vault';    // Your vault repo name
```

### Option 2: Use Your Existing Local Vault

If you already have an Obsidian vault with lots of notes:

**Step 1: Navigate to Your Vault**

```bash
cd /path/to/your/existing/vault
```

**Step 2: Initialize Git**

```bash
git init
git add .
git commit -m "Initial commit: My knowledge vault"
```

**Step 3: Create a GitHub Repository**

1. Go to https://github.com/new
2. Repository name: `my-knowledge-vault`
3. Make it **Public**
4. **DO NOT** check "Add a README" (your vault already has files)
5. Click **Create repository**

**Step 4: Push Your Vault to GitHub**

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-knowledge-vault.git
git push -u origin main
```

**Step 5: Install Obsidian Git Plugin** (same as Option 1, Step 4)

## 📝 How to Write Blog Posts

Just create markdown files in your Obsidian vault! Here's a template:

```markdown
# My Awesome Blog Post

This is a paragraph about something interesting I learned today.

## Key Points

- Point one
- Point two
- Point three

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello from my blog!");
}
\`\`\`

## Conclusion

These are my thoughts on the topic.
```

**Important Notes:**

- The first `# Heading` becomes your post title
- The folder name becomes the category
- All markdown features work: images, links, code, tables, etc.
- Files in the root folder will show up under their folder name

## 🔄 Daily Workflow

Once set up, your workflow is simple:

1. **Write in Obsidian** (just like normal!)
2. **Obsidian Git auto-commits** (every 10 minutes)
3. **Website auto-updates** (pulls from GitHub API)
4. **Done!** ✨ Your blog is updated automatically

### Manual Sync (if not using Obsidian Git):

```bash
# In your vault folder
git add .
git commit -m "New posts and updates"
git push
```

## 🎨 Organizing Your Posts

### By Folder

Create folders in Obsidian:
- `Blog/` - Main blog posts
- `TIL/` - Today I Learned
- `Projects/` - Project documentation
- `Notes/` - Quick notes

The website will automatically group posts by these folders!

### By Tags

You can also use Obsidian tags:

```markdown
# My Post

#programming #webdev #react

Content here...
```

(Tags are displayed in the markdown content)

## 🔒 Privacy & Private Notes

**Want to keep some notes private?**

**Option 1: Use a `.gitignore` file**

Create a file called `.gitignore` in your vault root:

```
# Private folders
Private/
Journal/
Personal/

# Specific files
secrets.md
todo.md
```

These files won't be synced to GitHub!

**Option 2: Separate Vaults**

- One vault for public blog posts (synced to GitHub)
- One vault for private notes (not synced)

## 🛠️ Troubleshooting

**Problem: Posts not showing on website**

1. Check the repository is public
2. Verify the repo name in `src/services/githubService.ts`
3. Check browser console for errors
4. Make sure files are `.md` format

**Problem: Obsidian Git not auto-syncing**

1. Make sure you've committed at least once manually first
2. Check plugin settings are enabled
3. Look at the bottom bar in Obsidian for Git status

**Problem: Images not showing**

- Images must be committed to the GitHub repo
- Use relative paths: `![Image](./images/photo.png)`
- Or use absolute URLs: `![Image](https://example.com/image.png)`

## 📚 Pro Tips

1. **Use Templates**: Create note templates in Obsidian for consistent blog posts
2. **Daily Notes**: Use Obsidian's daily notes feature for TIL entries
3. **Graph View**: Obsidian's graph view helps visualize connections between notes
4. **Backlinks**: Use `[[wiki-links]]` to connect related posts
5. **Folder Structure**: Start simple, add folders as you need them

## 🎯 Summary

1. ✅ Create a GitHub repository for your vault
2. ✅ Clone it or push your existing vault
3. ✅ Install Obsidian Git plugin for auto-sync
4. ✅ Update `githubService.ts` with your repo name
5. ✅ Write in Obsidian, auto-sync to GitHub
6. ✅ Website automatically displays your posts!

---

Happy writing! 🌱✨
