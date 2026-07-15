
import { useQuery } from '@tanstack/react-query';
import { fetchGists } from '@/services/gistsService';

export const useGists = () => {
  return useQuery({
    queryKey: ['gists'],
    queryFn: fetchGists,
    // Long cache: GitHub allows only 60 anonymous API calls/hour per IP,
    // so refetching aggressively just burns the visitor's quota
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 1,
  });
};
