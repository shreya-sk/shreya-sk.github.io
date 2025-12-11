import { useQuery } from '@tanstack/react-query';
import { getTILEntries, MarkdownFile } from '@/services/localMarkdownService';
import { TILEntry } from '@/types/blog';
import { cleanForExcerpt } from '@/utils/markdownUtils';

// Transform MarkdownFile to TILEntry format
const transformToTIL = (file: MarkdownFile): TILEntry => {
  // Extract date from filename (format: "DD - MM - YYYY" or similar)
  let dateString = '';
  const fileName = file.path.split('/').pop() || '';
  
  // Try to extract date from filename like "10 - 12 -2025.md"
  const dateMatch = fileName.match(/(\d{1,2})\s*-\s*(\d{1,2})\s*-?\s*(\d{4})/);
  
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, '0');
    const month = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3];
    dateString = `${year}-${month}-${day}`;
  }
  
  // Fallback to current date
  const date = dateString || new Date().toISOString().split('T')[0];
  
  // Clean content for display (remove the title heading)
  let cleanedContent = file.content.replace(/^#\s+.+$/m, '').trim();
  cleanedContent = cleanForExcerpt(cleanedContent);
  
  return {
    id: file.slug,
    content: cleanedContent || 'No content',
    date,
    path: file.path
  };
};

export const useTILEntries = () => {
  return useQuery<TILEntry[], Error>({
    queryKey: ['til-entries'],
    queryFn: async () => {
      const files = await getTILEntries();
      const entries = files.map(transformToTIL);
      
      // Sort by date (newest first)
      return entries.sort((a, b) => {
        try {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } catch {
          return 0;
        }
      });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Re-export TILEntry for backward compatibility
export type { TILEntry };
