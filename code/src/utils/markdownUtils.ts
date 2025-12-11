// Utility functions for cleaning and processing markdown content

/**
 * Remove emojis and problematic Unicode characters
 */
export const stripEmojis = (content: string): string => {
  if (!content || typeof content !== 'string') {
    console.warn('stripEmojis received invalid content:', typeof content);
    return '';
  }
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
    .replace(/:[a-z_]+:/g, '')
    // Remove zero-width characters and other invisible Unicode
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove special quotation marks and replace with standard ones
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Remove special dashes and replace with standard ones
    .replace(/[\u2013\u2014]/g, '-')
    // Remove bullet points and other list markers
    .replace(/[\u2022\u2023\u2043]/g, '')
    // Remove various brackets and parentheses variants
    .replace(/[\u3008\u3009\u300A\u300B]/g, '')
    // Replace special spaces with regular space
    .replace(/[\u00A0\u2000-\u200A\u202F\u205F]/g, ' ')
    // Remove combining diacritical marks
    .replace(/[\u0300-\u036F]/g, '')
    // Remove any remaining problematic non-printable characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
};

/**
 * Remove YAML frontmatter from markdown content
 */
export const stripFrontmatter = (content: string): string => {
  if (!content || typeof content !== 'string') {
    console.warn('stripFrontmatter received invalid content:', typeof content);
    return '';
  }
  // Match YAML frontmatter: --- ... ---
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
  return content.replace(frontmatterRegex, '').trim();
};

/**
 * Convert Obsidian image syntax to standard markdown
 * Obsidian: ![[path/to/image.png]] or ![[path/to/image.png|alt text]]
 * Standard: ![alt text](path/to/image.png)
 */
export const convertObsidianImages = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Match Obsidian image syntax: ![[path]] or ![[path|alt]]
  return content.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, path, alt) => {
    const altText = alt || path.split('/').pop()?.replace(/\.[^.]+$/, '') || 'image';
    // Remove ../ and normalize path
    const normalizedPath = path.replace(/^\.\.\//, '');
    return `![${altText}](${normalizedPath})`;
  });
};

/**
 * Convert Obsidian callouts to HTML-friendly format
 * Obsidian callouts: > [!note], > [!important], > [!warning], etc.
 */
export const convertObsidianCallouts = (content: string): string => {
  if (!content || typeof content !== 'string') {
    console.warn('convertObsidianCallouts received invalid content:', typeof content);
    return '';
  }
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
  if (!content || typeof content !== 'string') {
    console.warn('cleanForExcerpt received invalid content:', typeof content);
    return '';
  }
  let cleaned = stripFrontmatter(content);
  cleaned = stripEmojis(cleaned);

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
 * Process full content for display (strip frontmatter, convert Obsidian syntax, keep emojis)
 */
export const processMarkdownContent = (content: string): string => {
  if (!content || typeof content !== 'string') {
    console.warn('processMarkdownContent received invalid content:', typeof content);
    return '';
  }
  let processed = stripFrontmatter(content);

  // Convert Obsidian-specific syntax to standard markdown
  processed = convertObsidianImages(processed);
  processed = convertObsidianCallouts(processed);

  // Clean up problematic invisible characters but keep emojis
  processed = processed
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove Obsidian emoji syntax like :emoji_name: if needed
    .replace(/:([a-z_]+):/g, '')
    // Normalize quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Normalize dashes
    .replace(/[\u2013\u2014]/g, '-')
    // Fix common mojibake patterns (incorrectly decoded UTF-8)
    .replace(/â/g, '✓')  // Common checkbox
    .replace(/ð/g, '👉')  // Common pointer emoji
    .replace(/ð¥¸/g, '🥸')  // Face with disguise
    .replace(/ð/g, '📝')  // Memo/note
    .replace(/ð§/g, '🔧')  // Wrench/tool
    .replace(/â/g, '⚠')   // Warning sign
    .replace(/â¡/g, '⚡')  // Lightning
    .replace(/ð/g, '🔥');  // Fire

  return processed;
};