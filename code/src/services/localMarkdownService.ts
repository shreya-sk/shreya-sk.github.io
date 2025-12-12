
// Local Markdown Service - Reads from obsidian/ folder instead of GitHub API

import { BlogPost, TILEntry } from '@/types/blog';
import { processMarkdownContent } from '@/utils/markdownUtils';

export interface MarkdownFile {
  path: string;
  content: string;
  slug: string;
  title: string;
  category?: string;
}

// Vite's glob import - reads all .md files from obsidian folder
const markdownModules = import.meta.glob('../../../obsidian/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: false
});

/**
 * Get all markdown files from the obsidian folder
 */
export async function getAllMarkdownFiles(): Promise<MarkdownFile[]> {
  const files: MarkdownFile[] = [];

  for (const path in markdownModules) {
    try {
      const content = await markdownModules[path]();

      if (!content) {
        console.warn(`Empty content for ${path}`);
        continue;
      }

      // Extract metadata
      const cleanPath = path.replace('../../../obsidian/', '');
      const slug = cleanPath.replace('.md', '').toLowerCase().replace(/\s+/g, '-');
      const title = extractTitle(content) || extractTitleFromPath(cleanPath);
      const category = extractCategory(cleanPath);

      files.push({
        path: cleanPath,
        content,
        slug,
        title,
        category
      });
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
    }
  }

  console.log(`✅ Loaded ${files.length} markdown files`);
  return files;
}

/**

 * Get TIL (Today I Learned) entries

 */

export async function getTILEntries(): Promise<MarkdownFile[]> {

  const allFiles = await getAllMarkdownFiles();

  return allFiles.filter(file => file.path.startsWith('Daily - TIL/'));

}

/**

 * Get files by category (e.g., "DevOps", "Kong")

 */

export async function getFilesByCategory(category: string): Promise<MarkdownFile[]> {

  const allFiles = await getAllMarkdownFiles();

  return allFiles.filter(file => file.category === category);

}

/**

 * Get a single file by path

 */

export async function getFileByPath(filePath: string): Promise<MarkdownFile | null> {
  const normalizedPath = `../../../obsidian/${filePath}`;

  if (!(normalizedPath in markdownModules)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  try {
    const content = await markdownModules[normalizedPath]();

    return {
      path: filePath,
      content,
      slug: filePath.replace('.md', '').toLowerCase().replace(/\s+/g, '-'),
      title: extractTitle(content) || extractTitleFromPath(filePath),
      category: extractCategory(filePath)
    };
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

/**

 * Extract title from markdown content (first # heading)

 */

function extractTitle(content: string): string {

  const match = content.match(/^#\s+(.+)$/m);

  return match ? match[1].trim() : '';

}

/**

 * Extract title from file path as fallback

 */

function extractTitleFromPath(path: string): string {

  const filename = path.split('/').pop() || '';

  return filename.replace('.md', '').replace(/-/g, ' ');

}

/**

 * Extract category from file path (top-level folder)

 */

function extractCategory(path: string): string {

  const parts = path.split('/');

  return parts.length > 1 ? parts[0] : 'Uncategorized';

}

/**
 * Get all unique categories
 */
export async function getCategories(): Promise<string[]> {
  const allFiles = await getAllMarkdownFiles();
  const categories = new Set(allFiles.map(f => f.category).filter(Boolean));
  return Array.from(categories).sort();
}

// ==================== ADAPTERS FOR EXISTING INTERFACES ====================

/**
 * Fetch markdown files as BlogPost[] (matches githubService interface)
 */
export async function fetchMarkdownFiles(): Promise<BlogPost[]> {
  const files = await getAllMarkdownFiles();

  // Filter out TIL entries
  const blogFiles = files.filter(f => !f.path.startsWith('Daily - TIL/'));

  return blogFiles.map(file => ({
    id: file.slug,
    title: file.title,
    content: processMarkdownContent(file.content),
    path: file.path,
    folder: file.category || 'Uncategorized',
    date: new Date().toISOString().split('T')[0],
    slug: file.slug
  }));
}

/**
 * Fetch TIL entries as TILEntry[] (matches githubService interface)
 */
export async function fetchTILEntries(): Promise<TILEntry[]> {
  const tilFiles = await getTILEntries();

  return tilFiles.map(file => {
    // Try to extract date from filename (e.g., "10 - 12 -2025.md")
    const dateMatch = file.path.match(/(\d{1,2})\s*-\s*(\d{1,2})\s*-\s*(\d{4})/);
    let date = new Date().toISOString().split('T')[0];

    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      const month = dateMatch[2].padStart(2, '0');
      const year = dateMatch[3];
      date = `${year}-${month}-${day}`;
    }

    return {
      id: file.slug,
      content: processMarkdownContent(file.content),
      date,
      path: file.path
    };
  });
}

// Re-export BlogPost type for convenience
export type { BlogPost } from '@/types/blog';
