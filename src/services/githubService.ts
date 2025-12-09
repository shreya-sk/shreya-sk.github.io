import { processMarkdownContent } from '@/utils/markdownUtils';

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

    // Filter for markdown files, excluding README files
    const markdownFiles = data.tree.filter((file: GitHubFile) => {
      if (file.type !== 'blob' || !file.path || !file.path.endsWith('.md')) {
        return false;
      }

      // Extract filename from path
      const fileName = file.path.split('/').pop() || '';

      // Exclude README files and .obsidian config files
      if (fileName.toLowerCase().startsWith('readme') ||
          file.path.toLowerCase().includes('.obsidian/')) {
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

          // Extract title from content (first # heading) or use filename
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const fileName = file.path.split('/').pop()?.replace('.md', '') || 'Untitled';
          const title = titleMatch ? titleMatch[1] : fileName;

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
