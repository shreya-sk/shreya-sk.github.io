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

    // Filter for markdown files, excluding README files and TIL directory
    const markdownFiles = data.tree.filter((file: GitHubFile) => {
      if (file.type !== 'blob' || !file.path || !file.path.endsWith('.md')) {
        return false;
      }

      posts.push(...batchResults.filter((post): post is BlogPost => post !== null));

      // Exclude README files, .obsidian config files, and TIL directory
      if (fileName.toLowerCase().startsWith('readme') ||
          file.path.toLowerCase().includes('.obsidian/') ||
          file.path.toLowerCase().includes('daily - til/')) {
        return false;
      }
    }

    console.log(`Successfully processed ${posts.length} posts`);

    console.log(`Found ${markdownFiles.length} markdown files:`, markdownFiles.map((f: GitHubFile) => f.path));
    
    // Fetch content for each markdown file
    const posts: BlogPost[] = [];
    
    for (const file of markdownFiles) {
      try {
        const contentResponse = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${file.path}`);
        
        if (contentResponse.ok) {
          const contentData: GitHubContent = await contentResponse.json();
          const rawContent = atob(contentData.content); // Decode base64 content

          // Process content to remove frontmatter and convert Obsidian syntax
          const content = processMarkdownContent(rawContent);

          // Extract title ONLY from first heading line, not entire content
          // Look for first # heading, but only take the heading text itself
          const headingMatch = content.match(/^#\s+(.+)$/m);
          const fileName = file.path.split('/').pop()?.replace('.md', '') || 'Untitled';
          
          let title = fileName; // Default to filename
          
          if (headingMatch && headingMatch[1]) {
            // Get just the heading text, limit to reasonable length
            const headingText = headingMatch[1].trim();
            // Take only first line if heading spans multiple lines
            const firstLine = headingText.split('\n')[0];
            // Limit title to 100 characters max
            title = firstLine.length > 100 ? firstLine.substring(0, 97) + '...' : firstLine;
          }

          // Extract folder from path (use full directory path, not just top level)
          const pathParts = file.path.split('/');
          const folder = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : 'Root';

          // Generate slug from path
          const slug = file.path.replace('.md', '').toLowerCase().replace(/\s+/g, '-').replace(/\//g, '/');

          posts.push({
            id: file.sha,
            title,
            content,
            path: file.path,
            folder,
            date: new Date().toISOString().split('T')[0], // We'll use current date for now
            slug
          });
        } else {
          console.error(`Failed to fetch content for ${file.path}:`, contentResponse.status);
        }
      } catch (error) {
        console.error(`Failed to fetch content for ${file.path}:`, error);
      }
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
    let response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/main?recursive=1`);

    if (!response.ok && response.status === 409) {
      console.log('Main branch not found, trying master...');
      response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/master?recursive=1`);
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
        const contentResponse = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${file.path}`);
        
        if (contentResponse.ok) {
          const contentData: GitHubContent = await contentResponse.json();
          const rawContent = atob(contentData.content);

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
