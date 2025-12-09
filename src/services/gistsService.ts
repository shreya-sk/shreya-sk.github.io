
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

export const fetchGists = async (): Promise<Gist[]> => {
  try {
    console.log('Fetching gists from:', `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/gists`);

    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/gists`);

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
    const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`);

    if (!response.ok) {
      console.error('Failed to fetch gist content:', response.status);
      return null;
    }

    const gist: Gist = await response.json();
    return gist;
  } catch (error) {
    console.error('Error fetching gist content:', error);
    return null;
  }
};
