
import { useQuery } from '@tanstack/react-query';
import { fetchGists } from '@/services/gistsService';

export const useGists = () => {
  return useQuery({
    queryKey: ['gists'],
    queryFn: fetchGists,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
