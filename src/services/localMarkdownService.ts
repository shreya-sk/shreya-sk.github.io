// Local Markdown Service - Reads from obsidian/ folder instead of GitHub API

export interface MarkdownFile {
  path: string;
  content: string;
  slug: string;
  title: string;
  category?: string;
}

// Vite's glob import - reads all .md files from obsidian folder
const markdownModules = import.meta.glob('../../obsidian/**/*.md', {
  as: 'raw',
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
      const cleanPath = path.replace('../../obsidian/', '');
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
  const normalizedPath = `../../obsidian/${filePath}`;

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
  return Array.from(categories).sort() as string[];
}
