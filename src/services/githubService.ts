import { processMarkdownContent } from '@/utils/markdownUtils';

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  download_url?: string;
  content?: string;
  encoding?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  path: string;
  folder: string;
  date: string;
  slug: string;
}

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'shreya-sk';
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO || 'Knowledge-hub';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// Headers with optional authentication
const getHeaders = () => {
  const headers: HeadersInit = {
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
};

// Cache for fetched posts to avoid repeated API calls
let postsCache: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Recursively fetch all markdown files from a directory
const fetchDirectoryContents = async (path: string = ''): Promise<GitHubContent[]> => {
  try {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
    console.log(`Fetching directory: ${path || 'root'}`);

    const response = await fetch(url, { headers: getHeaders() });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Directory not found: ${path}`);
        return [];
      }
      throw new Error(`Failed to fetch directory ${path}: ${response.status}`);
    }

    const items: GitHubContent[] = await response.json();
    let allFiles: GitHubContent[] = [];

    for (const item of items) {
      // Skip .obsidian directories and README files
      if (item.path.toLowerCase().includes('.obsidian') ||
          item.name.toLowerCase().startsWith('readme')) {
        continue;
      }

      if (item.type === 'dir') {
        // Recursively fetch subdirectory contents
        const subFiles = await fetchDirectoryContents(item.path);
        allFiles = allFiles.concat(subFiles);
      } else if (item.type === 'file' && item.name.endsWith('.md')) {
        allFiles.push(item);
      }
    }

    return allFiles;
  } catch (error) {
    console.error(`Error fetching directory ${path}:`, error);
    return [];
  }
};

// Fetch and parse a single markdown file
const fetchMarkdownFile = async (file: GitHubContent): Promise<BlogPost | null> => {
  try {
    if (!file.download_url) {
      console.warn(`No download URL for ${file.path}`);
      return null;
    }

    console.log(`Fetching content for: ${file.path}`);
    const response = await fetch(file.download_url, { headers: getHeaders() });

    if (!response.ok) {
      console.error(`Failed to fetch ${file.path}: ${response.status}`);
      return null;
    }

    const rawContent = await response.text();
    const content = processMarkdownContent(rawContent);

    // Extract title from content (first # heading) or use filename
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const fileName = file.name.replace('.md', '');
    const title = titleMatch ? titleMatch[1] : fileName;

    // Extract folder from path
    const pathParts = file.path.split('/');
    const folder = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : 'Root';

    // Generate slug from path
    const slug = file.path.replace('.md', '').toLowerCase().replace(/\s+/g, '-');

    return {
      id: file.sha,
      title,
      content,
      path: file.path,
      folder,
      date: new Date().toISOString().split('T')[0],
      slug
    };
  } catch (error) {
    console.error(`Error processing ${file.path}:`, error);
    return null;
  }
};

export const fetchMarkdownFiles = async (forceRefresh: boolean = false): Promise<BlogPost[]> => {
  // Check cache first
  const now = Date.now();
  if (!forceRefresh && postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Using cached posts');
    return postsCache;
  }

  try {
    console.log('Fetching markdown files from GitHub...');

    // Fetch all markdown files recursively
    const markdownFiles = await fetchDirectoryContents();
    console.log(`Found ${markdownFiles.length} markdown files`);

    if (markdownFiles.length === 0) {
      console.warn('No markdown files found');
      return [];
    }

    // Fetch content for each file
    const posts: BlogPost[] = [];

    // Process files in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < markdownFiles.length; i += batchSize) {
      const batch = markdownFiles.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(file => fetchMarkdownFile(file))
      );

      posts.push(...batchResults.filter((post): post is BlogPost => post !== null));

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < markdownFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Successfully processed ${posts.length} posts`);

    // Update cache
    postsCache = posts;
    cacheTimestamp = now;

    // Store in localStorage as backup
    try {
      localStorage.setItem('blog-posts-cache', JSON.stringify({
        posts,
        timestamp: now
      }));
    } catch (e) {
      console.warn('Failed to store cache in localStorage:', e);
    }

    return posts;
  } catch (error) {
    console.error('Error fetching markdown files:', error);

    // Try to load from localStorage if available
    try {
      const cached = localStorage.getItem('blog-posts-cache');
      if (cached) {
        const { posts } = JSON.parse(cached);
        console.log('Loading posts from localStorage backup');
        return posts;
      }
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
    }

    return [];
  }
};

export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await fetchMarkdownFiles();
  console.log('Looking for slug:', slug);
  console.log('Available slugs:', posts.map(p => p.slug));

  // Normalize both slugs for comparison
  const normalizedSlug = slug.toLowerCase().trim();
  const found = posts.find(post => post.slug.toLowerCase().trim() === normalizedSlug);

  if (!found) {
    console.error(`Post not found for slug: ${slug}`);
  }

  return found || null;
};

// Fetch the default "Hey, there!" file
export const fetchDefaultPost = async (): Promise<BlogPost | null> => {
  const posts = await fetchMarkdownFiles();

  // Look for "Hey, there!" file (case-insensitive)
  const defaultPost = posts.find(post =>
    post.title.toLowerCase().includes('hey') && post.title.toLowerCase().includes('there')
  );

  if (defaultPost) {
    return defaultPost;
  }

  // Fallback to first post
  return posts.length > 0 ? posts[0] : null;
};
