
export interface Gist {
  id: string;
  description: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  files: {
    [key: string]: {
      filename: string;
      language: string;
      raw_url: string;
      size: number;
      content?: string;
    };
  };
  public: boolean;
}

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'shreya-sk';

// Use Netlify Function for GitHub API calls (keeps token server-side)
const NETLIFY_FUNCTION_URL = '/.netlify/functions/github-proxy';

// Helper to call GitHub API through Netlify Function proxy
const callGitHubAPI = async (endpoint: string, method: string = 'GET'): Promise<Response> => {
  // In development, use direct GitHub API calls (for local testing without Netlify)
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    // Fallback to direct GitHub API in development
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE}${endpoint}`;
    return fetch(fullUrl, {
      method,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }
    });
  }

  // In production, use Netlify Function proxy (token stays server-side)
  const response = await fetch(NETLIFY_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint, method }),
  });

  return response;
};

// Extract the first H1 heading from markdown content
export const extractFirstHeading = (content: string): string | null => {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
};

export const fetchGists = async (): Promise<Gist[]> => {
  try {
    console.log('Fetching gists from:', `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/gists`);

    const response = await callGitHubAPI(`/users/${GITHUB_USERNAME}/gists`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub Gists API Error:', response.status, errorData);
      throw new Error(`Failed to fetch gists: ${response.status}`);
    }

    const gists: Gist[] = await response.json();
    console.log(`Found ${gists.length} gists`);

    return gists;
  } catch (error) {
    console.error('Error fetching gists:', error);
    return [];
  }
};

export const fetchGistContent = async (gistId: string): Promise<Gist | null> => {
  try {
    console.log('Fetching gist content for ID:', gistId);

    if (!gistId || gistId.trim() === '') {
      console.error('Invalid gist ID provided:', gistId);
      return null;
    }

    const endpoint = `/gists/${gistId.trim()}`;
    console.log('Fetching gist:', endpoint);

    const response = await callGitHubAPI(endpoint);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch gist content:', response.status, errorData);
      return null;
    }

    const gist: Gist = await response.json();
    console.log('Gist fetched successfully:', gist.id);

    // Fetch content for each file
    for (const filename in gist.files) {
      const file = gist.files[filename];
      if (file.raw_url && !file.content) {
        try {
          // For raw_url, we need to fetch directly (it's a different domain)
          const contentResponse = await callGitHubAPI(file.raw_url);
          if (contentResponse.ok) {
            file.content = await contentResponse.text();
          }
        } catch (err) {
          console.error(`Failed to fetch content for ${filename}:`, err);
        }
      }
    }

    return gist;
  } catch (error) {
    console.error('Error fetching gist content:', error);
    return null;
  }
};
