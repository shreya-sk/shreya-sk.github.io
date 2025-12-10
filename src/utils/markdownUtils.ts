// Utility functions for cleaning and processing markdown content

/**
 * Remove emojis, problematic Unicode characters, and encoding artifacts
 */
export const stripEmojis = (content: string): string => {
  return content
    // Remove emojis and special symbols
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{1F000}-\u{1F02F}]/gu, '')
    .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '')
    .replace(/[\u{1F100}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')
    // Remove Obsidian emoji syntax like :emoji_name:
    .replace(/:[a-z_]+:/g, '')
    // Remove common Unicode replacement characters and encoding issues
    .replace(/\uFFFD/g, '') // Replacement character
    .replace(/\u00A0/g, ' ') // Non-breaking space to regular space
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width characters
    // Remove Windows-1252 encoding artifacts that appear as Â, Ã, etc.
    .replace(/Â\s?/g, '')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã§/g, 'ç')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã®/g, 'î')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã»/g, 'û')
    .replace(/Ã¯/g, 'ï')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã«/g, 'ë')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã/g, 'À')
    // Remove other common encoding artifacts
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€"/g, '–')
    .replace(/â€"/g, '—')
    .replace(/â€¢/g, '•')
    .replace(/â€¦/g, '...')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã€/g, 'À')
    // Clean up any remaining double spaces
    .replace(/  +/g, ' ')
    .trim();
};

/**
 * Remove YAML frontmatter from markdown content
 */
export const stripFrontmatter = (content: string): string => {
  // Match YAML frontmatter: --- ... ---
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
  return content.replace(frontmatterRegex, '').trim();
};

/**
 * Convert Obsidian callouts to HTML-friendly format
 * Obsidian callouts: > [!note], > [!important], > [!warning], etc.
 */
export const convertObsidianCallouts = (content: string): string => {
  const calloutRegex = /^>\s*\[!(note|important|warning|tip|info|question|success|error|bug|example|quote|abstract|summary|todo|hint|danger|attention|caution|failure|check|done)\](.*?)$/gim;

  return content.replace(calloutRegex, (match, type, title) => {
    const cleanTitle = title.trim() || type;
    return `> **${type.toUpperCase()}${cleanTitle ? ': ' + cleanTitle : ''}**`;
  });
};

/**
 * Clean content for excerpt display (remove frontmatter, callouts, links, etc.)
 */
export const cleanForExcerpt = (content: string): string => {
  let cleaned = stripFrontmatter(content);

  // Remove headings
  cleaned = cleaned.replace(/^#{1,6}\s+.+$/gm, '');

  // Remove Obsidian callout syntax
  cleaned = cleaned.replace(/^>\s*\[!.*?\].*$/gm, '');
  cleaned = cleaned.replace(/^>\s+/gm, '');

  // Remove markdown links but keep text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  // Remove images
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');

  // Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // Remove inline code
  cleaned = cleaned.replace(/`[^`]+`/g, '');

  // Remove bold/italic
  cleaned = cleaned.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');

  // Replace multiple newlines with space
  cleaned = cleaned.replace(/\n+/g, ' ');

  // Remove extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Strip encoding artifacts
  cleaned = stripEmojis(cleaned);

  return cleaned.trim();
};

/**
 * Process full content for display (strip frontmatter, convert callouts, remove emojis)
 */
export const processMarkdownContent = (content: string): string => {
  let processed = stripFrontmatter(content);
  processed = stripEmojis(processed);
  processed = convertObsidianCallouts(processed);
  return processed;
};
