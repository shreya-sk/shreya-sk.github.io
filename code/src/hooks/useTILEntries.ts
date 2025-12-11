import { useQuery } from '@tanstack/react-query';
import { fetchTILEntries } from '@/services/localMarkdownService';
import { TILEntry } from '@/types/blog';

export const useTILEntries = () => {
  return useQuery<TILEntry[], Error>({
    queryKey: ['til-entries'],
    queryFn: fetchTILEntries,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
