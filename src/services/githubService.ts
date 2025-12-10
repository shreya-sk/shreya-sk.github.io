import { processMarkdownContent, cleanForExcerpt } from '@/utils/markdownUtils';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
  type: string;
}

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
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
const REPO_OWNER = 'shreya-sk';
const REPO_NAME = 'Knowledge-hub';

export const fetchMarkdownFiles = async (): Promise<BlogPost[]> => {
  try {
    console.log('Fetching from:', `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}`);

    // Try main branch first, then master if main fails
    let response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/main?recursive=1`);

    if (!response.ok && response.status === 409) {
      // Branch might be 'master' instead of 'main'
      console.log('Main branch not found, trying master...');
      response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/master?recursive=1`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub API Error:', response.status, errorData);
      throw new Error(`Failed to fetch repository: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Repository tree data:', data);

    if (!data.tree || data.tree.length === 0) {
      console.warn('Repository is empty or has no files');
      return [];
    }

    // Filter for markdown files, excluding README files and TIL directory
    const markdownFiles = data.tree.filter((file: GitHubFile) => {
      if (file.type !== 'blob' || !file.path || !file.path.endsWith('.md')) {
        return false;
      }

      // Extract filename from path
      const fileName = file.path.split('/').pop() || '';

      // Exclude README files, .obsidian config files, and TIL directory
      if (fileName.toLowerCase().startsWith('readme') ||
          file.path.toLowerCase().includes('.obsidian/') ||
          file.path.toLowerCase().includes('daily - til/')) {
        return false;
      }

      return true;
    });

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
    
    console.log('Processed posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching markdown files:', error);
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
