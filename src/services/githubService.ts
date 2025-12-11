import { processMarkdownContent, cleanForExcerpt } from '@/utils/markdownUtils';

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

export interface TILEntry {
  id: string;
  content: string;
  date: string;
  path: string;
}

interface GitHubFile {
  path: string;
  type: string;
  sha: string;
}

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'shreya-sk';
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO || 'Knowledge-hub';

// Simple headers for public GitHub API (no authentication needed!)
// GitHub allows 60 requests/hour per IP for public repos - plenty for a personal blog
const getHeaders = (): HeadersInit => ({
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

// Cache for fetched posts to avoid repeated API calls
let postsCache: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch ALL markdown files using Git Tree API (single API call!)
const fetchAllMarkdownFiles = async (): Promise<GitHubFile[]> => {
  try {
    console.log('Fetching file tree from GitHub...');

    // Try main branch first, then master if main fails
    let response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/main?recursive=1`,
      { headers: getHeaders() }
    );

    if (!response.ok && response.status === 409) {
      console.log('Main branch not found, trying master...');
      response = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/master?recursive=1`,
        { headers: getHeaders() }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub API Error:', response.status, errorData);
      throw new Error(`Failed to fetch repository tree: ${response.status}`);
    }

    const data = await response.json();

    // Filter for markdown files, excluding specific directories
    const markdownFiles = data.tree.filter((file: GitHubFile) => {
      if (file.type !== 'blob' || !file.path || !file.path.endsWith('.md')) {
        return false;
      }

      // Skip .obsidian directories, README files, and Daily - TIL folder
      const pathLower = file.path.toLowerCase();
      return !pathLower.includes('.obsidian') &&
             !pathLower.includes('readme') &&
             !pathLower.includes('daily - til');
    });

    console.log(`Found ${markdownFiles.length} markdown files`);
    return markdownFiles;
  } catch (error) {
    console.error('Error fetching file tree:', error);
    return [];
  }
};

// Fetch and parse a single markdown file
const fetchMarkdownFile = async (file: GitHubFile): Promise<BlogPost | null> => {
  try {
    console.log(`Fetching content for: ${file.path}`);

    // Use GitHub API /contents endpoint to get base64-encoded content (avoids CORS)
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${file.path}`;
    const response = await fetch(url, { headers: getHeaders() });

    if (!response.ok) {
      // If rate limited or other error, log and skip this file
      console.error(`Failed to fetch ${file.path}: ${response.status}`);
      return null;
    }

    const data: GitHubContent = await response.json();

    // Decode base64 content with better error handling
    if (!data || !data.content || typeof data.content !== 'string') {
      console.warn(`No valid content for ${file.path}`, data);
      return null;
    }

    try {
      const base64Content = data.content.replace(/\n/g, '');
      const rawContent = atob(base64Content);

      // Ensure rawContent is valid before processing
      if (!rawContent || typeof rawContent !== 'string') {
        console.warn(`Invalid decoded content for ${file.path}:`, typeof rawContent, rawContent);
        return null;
      }

      if (rawContent.trim() === '') {
        console.warn(`Empty content after decode for ${file.path}`);
        return null;
      }

      const content = processMarkdownContent(rawContent);

      if (!content || typeof content !== 'string') {
        console.warn(`Invalid processed content for ${file.path}:`, typeof content);
        return null;
      }

      // Extract title from content (first # heading) or use filename
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const fileName = file.path.split('/').pop()?.replace('.md', '') || 'Untitled';
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
    } catch (decodeError) {
      console.error(`Error decoding content for ${file.path}:`, decodeError);
      return null;
    }
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

    // Fetch all markdown files using Git Tree API (1 API call instead of 10+!)
    const markdownFiles = await fetchAllMarkdownFiles();

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

export const fetchTILEntries = async (): Promise<TILEntry[]> => {
  try {
    console.log('Fetching TIL entries from:', `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}`);

    // Try main branch first, then master if main fails
    let response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/main?recursive=1`,
      { headers: getHeaders() }
    );

    if (!response.ok && response.status === 409) {
      console.log('Main branch not found, trying master...');
      response = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/master?recursive=1`,
        { headers: getHeaders() }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub API Error:', response.status, errorData);
      throw new Error(`Failed to fetch repository: ${response.status}`);
    }

    const data = await response.json();

    // Filter for markdown files in "Daily - TIL" directory
    const tilFiles = data.tree.filter((file: GitHubFile) => {
      if (file.type !== 'blob' || !file.path || !file.path.endsWith('.md')) {
        return false;
      }

      // Must be in "Daily - TIL" directory
      return file.path.toLowerCase().includes('daily - til/');
    });

    console.log(`Found ${tilFiles.length} TIL entries:`, tilFiles.map((f: GitHubFile) => f.path));
    
    // Fetch content for each TIL file
    const entries: TILEntry[] = [];
    
    for (const file of tilFiles) {
      try {
        const contentResponse = await fetch(
          `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${file.path}`,
          { headers: getHeaders() }
        );

        if (contentResponse.ok) {
          const contentData: GitHubContent = await contentResponse.json();

          // Safety check: ensure content exists
          if (!contentData.content) {
            console.warn(`No content for TIL file: ${file.path}`);
            continue;
          }

          const rawContent = atob(contentData.content.replace(/\n/g, ''));

          // Process content
          const content = processMarkdownContent(rawContent);

          // Extract date from title (format: "DD - MM - YYYY" or similar)
          // First try to get it from the first heading
          const titleMatch = content.match(/^#\s+(.+)$/m);
          let dateString = '';
          
          if (titleMatch && titleMatch[1]) {
            const title = titleMatch[1].trim();
            // Try to extract date from title like "10 - 12 - 2025" or "10-12-2025"
            const dateMatch = title.match(/(\d{1,2})\s*-\s*(\d{1,2})\s*-\s*(\d{4})/);
            
            if (dateMatch) {
              // Convert DD-MM-YYYY to YYYY-MM-DD
              const day = dateMatch[1].padStart(2, '0');
              const month = dateMatch[2].padStart(2, '0');
              const year = dateMatch[3];
              dateString = `${year}-${month}-${day}`;
            }
          }
          
          // Fallback: try filename
          if (!dateString) {
            const fileName = file.path.split('/').pop() || '';
            const fileMatch = fileName.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}-\d{1,2}-\d{4})/);
            if (fileMatch) {
              dateString = fileMatch[0];
              // Convert DD-MM-YYYY to YYYY-MM-DD if needed
              if (dateString.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
                const parts = dateString.split('-');
                dateString = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              }
            }
          }
          
          // Final fallback: use current date
          const date = dateString || new Date().toISOString().split('T')[0];

          // Clean content for display (remove the title heading)
          let cleanedContent = content.replace(/^#\s+.+$/m, '').trim();
          cleanedContent = cleanForExcerpt(cleanedContent);

          entries.push({
            id: file.sha,
            content: cleanedContent || 'No content',
            date,
            path: file.path
          });
        }
      } catch (error) {
        console.error(`Failed to fetch TIL content for ${file.path}:`, error);
      }
    }
    
    // Sort by date (newest first)
    entries.sort((a, b) => {
      try {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } catch {
        return 0;
      }
    });
    
    console.log('Processed TIL entries:', entries.length);
    return entries;
  } catch (error) {
    console.error('Error fetching TIL entries:', error);
    return [];
  }
};
