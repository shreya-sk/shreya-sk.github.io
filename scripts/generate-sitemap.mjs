#!/usr/bin/env node
// Build-time sitemap generator — runs before `vite build` (see package.json).
// Static routes + one entry per published note, mirroring the slug logic in
// localMarkdownService (lowercase, spaces → dashes, .md stripped).

import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const VAULT = join(ROOT, 'obsidian');
const SITE = 'https://shreya-sk.github.io';

const staticRoutes = ['/', '/blog', '/til', '/gists', '/resume'];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'Daily - TIL' || name.startsWith('.')) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

const noteRoutes = [];
try {
  for (const file of walk(VAULT)) {
    const rel = relative(VAULT, file);
    const base = rel.split('/').pop();
    if (!rel.endsWith('.md') || rel.endsWith('.excalidraw.md') || base === '.md') continue;
    if (base === 'Hey, there!.md' || base === 'recent.json') continue;
    const slug = rel.replace(/\.md$/, '').toLowerCase().replace(/\s+/g, '-');
    noteRoutes.push(`/blog/${slug.split('/').map(encodeURIComponent).join('/')}`);
  }
} catch (err) {
  console.warn('sitemap: could not walk obsidian/:', err.message);
}

const today = new Date().toISOString().split('T')[0];
const urls = [...staticRoutes, ...noteRoutes]
  .map(
    (u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(ROOT, 'public', 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${staticRoutes.length} static + ${noteRoutes.length} note routes`);
