import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'shreya-sk';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Knowledge-hub';

interface GitHubProxyRequest {
  endpoint: string;
  method?: string;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Parse request body
    const requestBody: GitHubProxyRequest = event.body
      ? JSON.parse(event.body)
      : { endpoint: event.queryStringParameters?.endpoint || '' };

    const { endpoint, method = 'GET' } = requestBody;

    if (!endpoint) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing endpoint parameter' }),
      };
    }

    // Build full GitHub API URL
    const baseUrl = 'https://api.github.com';
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    console.log('Proxying request to:', fullUrl);

    // Make request to GitHub API with token
    const githubHeaders: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Knowledge-Hub-Blog',
    };

    if (GITHUB_TOKEN) {
      githubHeaders['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(fullUrl, {
      method,
      headers: githubHeaders,
    });

    const data = await response.json();

    // Return the GitHub API response
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Error proxying GitHub request:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
