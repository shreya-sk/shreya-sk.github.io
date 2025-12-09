# Obsidian Blog Setup Guide

Welcome to your Obsidian-powered GitHub Pages blog! This guide will help you connect your local Obsidian vault and deploy your beautiful, minimal website.

## 🎨 Design Philosophy

Your blog features an **Obsidian-inspired, sage minimalist design** with:
- Clean, modern typography with the Inter font
- Soft sage green color palette
- Beautiful markdown rendering with syntax highlighting
- Responsive design that works on all devices
- Smooth animations and transitions
- Code blocks with syntax highlighting

## 📁 Project Structure

```
daily-thought-display/
├── src/
│   ├── components/       # React UI components
│   ├── pages/           # Page routes (Index, Blog, BlogPost, TIL)
│   ├── services/        # GitHub API integration
│   └── hooks/           # React hooks for data fetching
├── public/              # Static assets
└── .github/workflows/   # GitHub Actions for deployment
```

## 🚀 Quick Start

### 1. Connect Your Obsidian Vault to GitHub

**Option A: Create a New Repository for Your Vault**

1. Create a new GitHub repository (e.g., `my-obsidian-vault`)
2. Make it public or private (your choice)
3. In your local Obsidian vault folder, initialize Git:
   ```bash
   cd /path/to/your/obsidian/vault
   git init
   git add .
   git commit -m "Initial commit: My Obsidian vault"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/my-obsidian-vault.git
   git push -u origin main
   ```

**Option B: Use Your Existing Repository**

If you're already using the `Knowledge-hub` repository (currently configured), just make sure it's up to date:

```bash
cd /path/to/your/Knowledge-hub
git add .
git commit -m "Update knowledge base"
git push
```

### 2. Update the Blog Configuration

The blog is currently configured to fetch from `shreya-sk/Knowledge-hub`. To change this:

1. Open `src/services/githubService.ts`
2. Update lines 4-5:
   ```typescript
   const GITHUB_OWNER = 'YOUR-GITHUB-USERNAME';
   const GITHUB_REPO = 'your-vault-repo-name';
   ```

### 3. Deploy to GitHub Pages

**Enable GitHub Pages:**

1. Go to your repository on GitHub: `https://github.com/shreya-sk/daily-thought-display`
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow is already set up in `.github/workflows/deploy.yml`

**Automatic Deployment:**

Every time you push to the `main` branch, your site will automatically rebuild and deploy! 🎉

Your site will be available at: `https://shreya-sk.github.io/daily-thought-display/`

### 4. Sync Your Obsidian Notes

**Manual Sync:**

Whenever you want to update your blog with new Obsidian notes:

```bash
cd /path/to/your/obsidian/vault
git add .
git commit -m "New thoughts and learnings"
git push
```

The blog will automatically fetch the latest content from your GitHub repository!

**Automatic Sync (Optional):**

You can set up automatic syncing using:
- [Obsidian Git Plugin](https://github.com/denolehov/obsidian-git) - Auto-commit and push from Obsidian
- GitHub Actions with scheduled workflows
- Git hooks for automatic commits

## 🎯 How It Works

1. **Your Obsidian Vault** → Stored in a GitHub repository
2. **This Blog App** → Fetches markdown files via GitHub API
3. **GitHub Pages** → Hosts your beautiful static site
4. **Automatic Updates** → Changes to your vault appear on your blog automatically

## 📝 Writing Blog Posts

Your markdown files from Obsidian will automatically become blog posts! The app:

- Extracts the first `# Heading` as the post title
- Organizes posts by folder structure
- Renders all markdown features (links, images, code blocks, tables, etc.)
- Calculates read time automatically
- Provides search and filtering

**Supported Markdown Features:**

✅ Headings, paragraphs, lists
✅ **Bold**, *italic*, `code`
✅ Links and images
✅ Code blocks with syntax highlighting
✅ Tables
✅ Blockquotes
✅ Task lists
✅ And more with GitHub Flavored Markdown!

## 🛠️ Development

**Run locally:**

```bash
npm install
npm run dev
```

Visit `http://localhost:8080`

**Build for production:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

## 🎨 Customization

### Change Colors

Edit `src/index.css` to customize the sage green theme:

```css
:root {
  --primary: 150 30% 45%;  /* Main sage green */
  --background: 50 20% 98%; /* Background color */
  /* ... more colors ... */
}
```

### Change Repository Source

Edit `src/services/githubService.ts`:

```typescript
const GITHUB_OWNER = 'your-username';
const GITHUB_REPO = 'your-repo';
```

### Customize Layout

- **Header**: `src/components/Header.tsx`
- **Hero Section**: `src/components/Hero.tsx`
- **Blog Cards**: `src/components/BlogCard.tsx`

## 🔧 Troubleshooting

**Posts not showing up?**
- Check that your vault repository is public or you've added a GitHub token
- Verify the repository name in `githubService.ts`
- Check browser console for API errors

**Styling looks broken?**
- Run `npm install` to ensure all dependencies are installed
- Clear browser cache
- Check that Tailwind CSS is properly configured

**GitHub Pages not deploying?**
- Verify GitHub Actions is enabled in Settings → Actions
- Check the Actions tab for build errors
- Ensure GitHub Pages is set to use GitHub Actions as source

## 📚 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Markdown** - Markdown rendering
- **TanStack Query** - Data fetching
- **GitHub Pages** - Hosting

## 🌟 Features

- ✨ Beautiful, minimal, Obsidian-inspired design
- 📱 Fully responsive mobile design
- 🎨 Syntax highlighting for code blocks
- 🔍 Search and filter blog posts
- 📂 Automatic folder-based organization
- ⚡ Fast page loads with optimized builds
- 🔄 Automatic deployment on push

## 🤝 Need Help?

- Check the [GitHub repository](https://github.com/shreya-sk/daily-thought-display)
- Open an issue for bugs or questions
- Review the code - it's well-documented!

---

Enjoy your beautiful new Obsidian blog! 🌱
