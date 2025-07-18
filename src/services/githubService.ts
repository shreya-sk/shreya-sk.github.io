
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
    // First, get the repository structure
    const response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/main?recursive=1`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repository structure');
    }
    
    const data = await response.json();
    const markdownFiles = data.tree.filter((file: GitHubFile) => 
      file.name.endsWith('.md') && file.type === 'blob'
    );
    
    // Fetch content for each markdown file
    const posts: BlogPost[] = [];
    
    for (const file of markdownFiles) {
      try {
        const contentResponse = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${file.path}`);
        
        if (contentResponse.ok) {
          const contentData: GitHubContent = await contentResponse.json();
          const content = atob(contentData.content); // Decode base64 content
          
          // Extract title from content (first # heading) or use filename
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : file.name.replace('.md', '');
          
          // Extract folder from path
          const pathParts = file.path.split('/');
          const folder = pathParts.length > 1 ? pathParts[0] : 'Root';
          
          // Generate slug from filename
          const slug = file.name.replace('.md', '').toLowerCase().replace(/\s+/g, '-');
          
          posts.push({
            id: file.sha,
            title,
            content,
            path: file.path,
            folder,
            date: new Date().toISOString().split('T')[0], // We'll use current date for now
            slug: `${folder.toLowerCase().replace(/\s+/g, '-')}/${slug}`
          });
        }
      } catch (error) {
        console.error(`Failed to fetch content for ${file.path}:`, error);
      }
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching markdown files:', error);
    return [];
  }
};

export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await fetchMarkdownFiles();
  return posts.find(post => post.slug === slug) || null;
};
