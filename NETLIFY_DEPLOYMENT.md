# 🚀 Netlify Deployment Guide

This guide will help you deploy your Knowledge Hub blog to Netlify with secure token management.

## ✨ What Changed?

**Before:** GitHub token was embedded in the built JavaScript files → GitHub automatically revoked it
**After:** GitHub token stays server-side in Netlify Functions → Never exposed to the client → No more token revocation!

---

## 📋 Prerequisites

1. A GitHub account with your `Knowledge-hub` repository
2. A GitHub Personal Access Token with `public_repo` scope
3. A Netlify account (free tier is fine) - Sign up at https://netlify.com

---

## 🎯 Step-by-Step Deployment

### **Step 1: Create a Netlify Account**

1. Go to https://app.netlify.com/signup
2. Sign up with your GitHub account (recommended for easy integration)
3. Authorize Netlify to access your GitHub repositories

### **Step 2: Import Your Repository**

1. Click **"Add new site" → "Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your `shreya-sk/daily-thought-display` repository (or whatever your repo is named)
4. Configure build settings:
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions` (should auto-detect)
5. Click **"Deploy site"** (don't worry, we'll add the token next!)

### **Step 3: Add Your GitHub Token (CRITICAL)**

1. In Netlify, go to **Site settings → Environment variables**
2. Click **"Add a variable" → "Add a single variable"**
3. Enter:
   - **Key:** `GITHUB_TOKEN`
   - **Value:** `ghp_your_actual_token_here` (your GitHub Personal Access Token)
   - **Scopes:** Select "Production" and "Deploy previews"
4. Click **"Create variable"**

**IMPORTANT:** Use the environment variable name `GITHUB_TOKEN` (NOT `VITE_GITHUB_TOKEN`)

### **Step 4: Redeploy Your Site**

1. Go to **Deploys** tab
2. Click **"Trigger deploy" → "Deploy site"**
3. Wait for the build to complete (~2-3 minutes)
4. Your site should now be live! 🎉

---

## ✅ Verify It's Working

1. Visit your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. Open the browser console (F12)
3. You should see:
   - ✅ Blog posts loading successfully
   - ✅ TIL entries displaying
   - ✅ Gists showing up
   - ✅ NO 403 errors
   - ✅ NO token visible in Network tab or JavaScript files

---

## 🔒 Security Benefits

- ✅ GitHub token stays server-side (in Netlify Functions)
- ✅ Never embedded in client JavaScript
- ✅ No more GitHub secret scanning alerts
- ✅ Token can't be extracted from your built site
- ✅ Same user experience, much more secure!

---

## 🛠️ Local Development

For local development, the site will use direct GitHub API calls (without authentication):

```bash
npm run dev
```

This works fine for testing, but you might hit the 60 requests/hour rate limit. If you need more requests during development, you can temporarily add:

```bash
# .env.local (for local dev only)
VITE_GITHUB_TOKEN=your_token_here
```

**Remember:** Never commit `.env.local` to git!

---

## 🌐 Custom Domain (Optional)

Want to use your own domain?

1. In Netlify: **Domain settings → Add custom domain**
2. Follow the instructions to update your DNS settings
3. Netlify provides free HTTPS/SSL automatically! ✨

---

## 🆘 Troubleshooting

### Still getting 403 errors?

1. **Check environment variable:**
   - Go to **Site settings → Environment variables**
   - Verify `GITHUB_TOKEN` is set correctly
   - Make sure it's enabled for "Production" scope

2. **Verify token permissions:**
   - Go to https://github.com/settings/tokens
   - Confirm your token has `public_repo` scope
   - Make sure the token hasn't expired

3. **Redeploy:**
   - **Deploys → Trigger deploy → Clear cache and deploy site**

### Functions not working?

1. Check **Functions** tab in Netlify dashboard
2. Look for `github-proxy` function
3. Click on it to see execution logs
4. Errors will appear there

### Build failing?

1. Go to **Deploys → [Latest deploy] → Deploy log**
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - TypeScript errors (fix locally first)
   - Node version mismatch (we're using Node 18)

---

## 📊 Monitoring

Netlify provides great analytics:
- **Analytics** tab: Page views, unique visitors
- **Functions** tab: See how many API calls you're making
- **Bandwidth** tab: Monitor data usage (free tier: 100GB/month)

---

## 🎉 You're Done!

Your blog is now deployed securely on Netlify with server-side token management. No more GitHub token alerts!

**Live Site:** Check your Netlify dashboard for your site URL
**Updates:** Every push to your GitHub branch will automatically redeploy!

---

## 💡 Pro Tips

1. **Auto-deploys:** By default, Netlify redeploys on every push to your main branch
2. **Deploy previews:** Pull requests get their own preview URLs
3. **Rollback:** Can instantly rollback to any previous deploy
4. **Forms:** Netlify has built-in form handling if you want to add contact forms
5. **Analytics:** Upgrade for more detailed analytics (optional)

Happy blogging! 📝✨
