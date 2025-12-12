import { processMarkdownContent } from '@/utils/markdownUtils';

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  download_url?: string;
}

export interface TILEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  dateFormatted: string;
  path: string;
}

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'shreya-sk';
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO || 'Knowledge-hub';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const TIL_FOLDER = 'Daily - TIL';

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

// Cache for TIL entries
let tilCache: TILEntry[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Parse date from heading like "10 - 12 - 2025" to Date object
const parseDateFromHeading = (heading: string): Date | null => {
  // Match patterns like "10 - 12 - 2025" or "10-12-2025"
  const match = heading.match(/(\d{1,2})\s*-\s*(\d{1,2})\s*-\s*(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  return null;
};

// Format date to readable format
const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

// Fetch TIL files from the Daily - TIL folder
const fetchTILDirectory = async (): Promise<GitHubContent[]> => {
  try {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TIL_FOLDER}`;
    console.log(`Fetching TIL directory: ${TIL_FOLDER}`);

    const response = await fetch(url, { headers: getHeaders() });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`TIL directory not found: ${TIL_FOLDER}`);
        return [];
      }
      throw new Error(`Failed to fetch TIL directory: ${response.status}`);
    }

    const items: GitHubContent[] = await response.json();

    // Filter only markdown files
    return items.filter(item => item.type === 'file' && item.name.endsWith('.md'));
  } catch (error) {
    console.error(`Error fetching TIL directory:`, error);
    return [];
  }
};

// Fetch and parse a single TIL file
const fetchTILFile = async (file: GitHubContent): Promise<TILEntry | null> => {
  try {
    if (!file.download_url) {
      console.warn(`No download URL for ${file.path}`);
      return null;
    }

    console.log(`Fetching TIL content for: ${file.path}`);
    const response = await fetch(file.download_url, { headers: getHeaders() });

    if (!response.ok) {
      console.error(`Failed to fetch ${file.path}: ${response.status}`);
      return null;
    }

    const rawContent = await response.text();
    const content = processMarkdownContent(rawContent);

    // Extract first H1 heading (should be the date like "10 - 12 - 2025")
    const headingMatch = content.match(/^#\s+(.+)$/m);
    const heading = headingMatch ? headingMatch[1] : file.name.replace('.md', '');

    // Parse date from heading
    const date = parseDateFromHeading(heading);
    const dateFormatted = date ? formatDate(date) : heading;
    const dateISO = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    return {
      id: file.sha,
      title: heading,
      content,
      date: dateISO,
      dateFormatted,
      path: file.path,
    };
  } catch (error) {
    console.error(`Error processing TIL file ${file.path}:`, error);
    return null;
  }
};

// Fetch all TIL entries
export const fetchTILEntries = async (forceRefresh: boolean = false): Promise<TILEntry[]> => {
  // Check cache first
  const now = Date.now();
  if (!forceRefresh && tilCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Using cached TIL entries');
    return tilCache;
  }

  try {
    console.log('Fetching TIL entries from GitHub...');

    // Fetch all TIL markdown files
    const tilFiles = await fetchTILDirectory();
    console.log(`Found ${tilFiles.length} TIL files`);

    if (tilFiles.length === 0) {
      console.warn('No TIL files found');
      return [];
    }

    // Fetch content for each file
    const entries: TILEntry[] = [];

    // Process files in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < tilFiles.length; i += batchSize) {
      const batch = tilFiles.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(file => fetchTILFile(file))
      );

      entries.push(...batchResults.filter((entry): entry is TILEntry => entry !== null));

      // Small delay between batches
      if (i + batchSize < tilFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Sort by date (newest first)
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`Successfully processed ${entries.length} TIL entries`);

    // Update cache
    tilCache = entries;
    cacheTimestamp = now;

    // Store in localStorage as backup
    try {
      localStorage.setItem('til-cache', JSON.stringify({
        entries,
        timestamp: now
      }));
    } catch (e) {
      console.warn('Failed to store TIL cache in localStorage:', e);
    }

    return entries;
  } catch (error) {
    console.error('Error fetching TIL entries:', error);

    // Try to load from localStorage if available
    try {
      const cached = localStorage.getItem('til-cache');
      if (cached) {
        const { entries } = JSON.parse(cached);
        console.log('Loading TIL entries from localStorage backup');
        return entries;
      }
    } catch (e) {
      console.warn('Failed to load TIL from localStorage:', e);
    }

    return [];
  }
};
