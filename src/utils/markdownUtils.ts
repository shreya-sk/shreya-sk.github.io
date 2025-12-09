// Utility functions for cleaning and processing markdown content

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
 * Process full content for display (strip frontmatter, convert callouts)
 */
export const processMarkdownContent = (content: string): string => {
  let processed = stripFrontmatter(content);
  processed = convertObsidianCallouts(processed);
  return processed;
};
