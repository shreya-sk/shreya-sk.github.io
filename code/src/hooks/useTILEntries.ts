import { useQuery } from '@tanstack/react-query';
import { fetchTILEntries, TILEntry } from '@/services/githubService';

export const useTILEntries = () => {
  return useQuery<TILEntry[], Error>({
    queryKey: ['til-entries'],
    queryFn: fetchTILEntries,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
