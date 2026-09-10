// Utility functions for cleaning and processing markdown content

/**
 * Fix UTF-8 mojibake (incorrectly decoded UTF-8 as Latin-1/Windows-1252)
 * This happens when UTF-8 bytes are interpreted as a different encoding
 */
export const fixMojibake = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Common emoji mojibake patterns
  const mojibakePatterns: [RegExp, string][] = [
    // Emojis
    [/ð°/g, '💰'],  // Money bag
    [/â¡/g, '⚡'],  // Lightning
    [/ð§/g, '🔧'],  // Wrench
    [/ð/g, '🗑️'],  // Trash
    [/ðï¸/g, '🗑️'],  // Trash with variant
    [/ðï¸/g, '🏗️'],  // Construction
    [/ðï¸/g, '🖥️'],  // Desktop computer
    [/ð¥¸/g, '🥸'],  // Disguised face
    [/ð/g, '📝'],  // Memo
    [/ðï¸/g, '📝️'],  // Memo with variant
    [/ð/g, '📄'],  // Page
    [/âï¸/g, '⚙️'],  // Gear
    [/ð/g, '📚'],  // Books
    [/ð/g, '🔍'],  // Magnifying glass
    [/ðï¸/g, '🏢'],  // Office building
    [/ð/g, '📜'],  // Scroll
    [/ð/g, '🐳'],  // Whale (Docker logo)
    [/â¸ï¸/g, '☸️'],  // Kubernetes symbol
    [/ð/g, '🚀'],  // Rocket
    [/ð¯/g, '🎯'],  // Target
    [/ð/g, '🔑'],  // Key
    [/ð/g, '🔄'],  // Arrows
    [/ð/g, '📦'],  // Package
    [/ð/g, '🌐'],  // Globe
    [/ð/g, '📊'],  // Bar chart
    [/ð¨âð»/g, '👨‍💻'],  // Male technologist
    [/ð¨âð§/g, '👨‍🔧'],  // Male mechanic
    [/ð/g, '📋'],  // Clipboard
    [/ð/g, '📚'],  // Books
    [/ð¢/g, '🐢'],  // Turtle
    [/ð¶/g, '🚶'],  // Walking
    [/ð/g, '🔒'],  // Lock
    [/ð/g, '🔓'],  // Unlocked
    [/â±ï¸/g, '⏱️'],  // Stopwatch
    [/ð½/g, '💽'],  // Disk

    // Checkmarks and symbols
    [/â/g, '✅'],  // Check mark
    [/â/g, '❌'],  // Cross mark
    [/â/g, '⚠'],   // Warning
    [/â/g, '✓'],   // Check
    [/â/g, '➡'],   // Right arrow

    // Special characters that get corrupted
    [/Â°/g, '°'],  // Degree symbol
    [/Â§/g, '§'],  // Section symbol
    [/Â¡/g, '¡'],  // Inverted exclamation
    [/Â¿/g, '¿'],  // Inverted question mark
  ];

  let fixed = content;
  for (const [pattern, replacement] of mojibakePatterns) {
    fixed = fixed.replace(pattern, replacement);
  }

  return fixed;
};

/**
 * Convert Obsidian wiki links to website URLs
 * [[link]] or [[link|display text]] or [[folder/link|text]]
 */
export const convertWikiLinks = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Match [[path/to/file|display text]] or [[file]] — but NOT image embeds ![[...]]
  return content.replace(/(?<!!)\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, path, displayText) => {
    // Remove ../ and .md extension
    const cleanPath = path.replace(/^\.\.\//, '').replace(/\.md$/, '');

    // Create URL slug (lowercase, replace spaces with hyphens)
    const slug = cleanPath.toLowerCase().replace(/\s+/g, '-');

    // Use display text if provided, otherwise use the filename
    const text = displayText || path.split('/').pop()?.replace(/\.md$/, '') || cleanPath;

    // Link to /blog route (assuming all notes are under /blog)
    return `[${text}](/blog?note=${encodeURIComponent(cleanPath)})`;
  });
};

/**
 * Extract frontmatter data from markdown content
 */
export const extractFrontmatter = (content: string): { [key: string]: string } => {
  if (!content || typeof content !== 'string') {
    return {};
  }

  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {};
  }

  const frontmatterText = match[1];
  const frontmatter: { [key: string]: string } = {};

  // Parse YAML-like frontmatter (simple key: value pairs)
  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return frontmatter;
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
 * Standard: ![alt text](/obsidian/path/to/image.png)
 */
export const convertObsidianImages = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Match Obsidian image syntax: ![[path]] or ![[path|alt]]
  // Images are published flat to public/attachments/ by scripts/sync-vault.sh
  // (only images actually referenced by published notes are copied there).
  return content.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, path, alt) => {
    const filename = path.split('/').pop() || path;
    const altText = alt || filename.replace(/\.[^.]+$/, '') || 'image';
    return `![${altText}](/attachments/${encodeURIComponent(filename)})`;
  });
};

/**
 * Convert Obsidian callouts to HTML-friendly format
 * Obsidian callouts: > [!note], > [!important], > [!warning], etc.
 */
export const convertObsidianCallouts = (content: string): string => {
  if (typeof content !== 'string') {
    console.warn('convertObsidianCallouts received non-string content:', typeof content);
    return '';
  }
  if (!content) {
    // Empty string is valid, just return it without warning
    return '';
  }
  const calloutRegex = /^>\s*\[!(note|important|warning|tip|info|question|success|error|bug|example|quote|abstract|summary|todo|hint|danger|attention|caution|failure|check|done)\](.*?)$/gim;

  return content.replace(calloutRegex, (match, type, title) => {
    const cleanTitle = title.trim() || type;
    return `> **${type.toUpperCase()}${cleanTitle ? ': ' + cleanTitle : ''}**`;
  });
};

/**
 * A one-line preview of a TIL note: strips frontmatter plus the note's date
 * heading ("# 08-09-2026") and bold title line ("**CRON JOBS**") - both are
 * titles, not the body - so a truncated/clamped preview reads as one
 * sentence instead of a title smashed into the paragraph that follows it.
 */
export const tilPreviewText = (raw = '', maxLength = 120): string => {
  let lines = raw
    .replace(/^---[\s\S]*?---\s*/, '')
    .split('\n')
    .filter((l) => l.trim().length > 0);
  while (
    lines.length > 1 &&
    (/^#{1,6}\s/.test(lines[0]) || /^\*\*[^*]+\*\*$/.test(lines[0].trim()))
  ) {
    lines = lines.slice(1);
  }
  return lines.join(' ').replace(/[#>*`]/g, '').trim().slice(0, maxLength);
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

  // Fix any UTF-8 mojibake issues first
  processed = fixMojibake(processed);

  // Remove the note's own H1 - the page header already renders the title,
  // so leaving it in shows the heading twice. Not anchored to the very
  // start of the file: notes commonly have a breadcrumb line and/or an
  // Obsidian inline-tags line (e.g. "#ansible #devops") before the H1,
  // which would otherwise block a start-anchored match entirely. The
  // [ \t]+ after # (vs \s+) also keeps this from matching "#tag" lines,
  // which have no space after the hash.
  processed = processed.replace(/^[ \t]*#[ \t]+[^\n]+\n+/m, '');

  // Remove Obsidian breadcrumb nav lines (e.g. "← [[Notes/HOME|Home]] · [[Docker MOC]]")
  // - they point at private vault folders and are broken on the site
  processed = processed
    .split('\n')
    .filter((line) => !/^\s*(\\?←|&larr;)/.test(line.trim()))
    .join('\n');

  // Remove Dataview / DataviewJS blocks - they're Obsidian plugin scripts
  // that only execute inside Obsidian; on the web they'd render as raw code
  processed = processed.replace(/```dataviewjs?\s[\s\S]*?```/g, '');

  // Convert Obsidian-specific syntax to standard markdown
  // Images FIRST: ![[img.png]] must be converted before the wikilink pass,
  // otherwise the wikilink regex eats the [[...]] and breaks every embed
  processed = convertObsidianImages(processed);
  processed = convertWikiLinks(processed);
  processed = convertObsidianCallouts(processed);

  // Clean up problematic invisible characters but keep emojis
  processed = processed
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalize quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Normalize dashes
    .replace(/[\u2013\u2014]/g, '-');

  return processed;
};