// Utility functions for cleaning and processing markdown content

/**
 * Remove emojis and problematic Unicode characters
 */
export const stripEmojis = (content: string): string => {
  // Remove emojis and special symbols
  let cleaned = content
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emoticons
    .replace(/[\u{2600}-\u{26FF}]/gu, '') // Miscellaneous Symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
    .replace(/[\u{1F000}-\u{1F02F}]/gu, '') // Mahjong Tiles
    .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '') // Playing Cards
    .replace(/[\u{1F100}-\u{1F64F}]/gu, '') // Enclosed characters
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation Selectors
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '') // Flags
    .replace(/[\u{E000}-\u{F8FF}]/gu, '') // Private Use Area
    .replace(/[\u{2000}-\u{206F}]/gu, ' ') // General Punctuation (replace with space)
    .replace(/[\u{2190}-\u{21FF}]/gu, '') // Arrows
    .replace(/[\u{2300}-\u{23FF}]/gu, '') // Miscellaneous Technical
    .replace(/[\u{25A0}-\u{25FF}]/gu, '') // Geometric Shapes
    .replace(/[\u{2B00}-\u{2BFF}]/gu, '') // Miscellaneous Symbols and Arrows
    // Remove Obsidian emoji syntax like :emoji_name:
    .replace(/:[a-z_]+:/gi, '')
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // More aggressive: remove any character outside basic Latin + common punctuation
    // This catches weird Unicode that slips through
    .replace(/[^\u0000-\u007F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\n\r\t]/g, '');

  return cleaned.trim();
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
