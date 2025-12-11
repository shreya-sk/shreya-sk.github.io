
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

// Simple headers for public GitHub API (no authentication needed!)
// GitHub allows 60 requests/hour per IP for public repos - plenty for a personal blog
const getHeaders = (): HeadersInit => ({
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

// Extract the first H1 heading from markdown content
export const extractFirstHeading = (content: string): string | null => {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
};

export const fetchGists = async (): Promise<Gist[]> => {
  try {
    console.log('Fetching gists from:', `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/gists`);

    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/gists`,
      { headers: getHeaders() }
    );

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

    const url = `${GITHUB_API_BASE}/gists/${gistId.trim()}`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url, { headers: getHeaders() });

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
          const contentResponse = await fetch(file.raw_url, { headers: getHeaders() });
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
