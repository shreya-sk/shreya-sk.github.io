
import { useQuery } from '@tanstack/react-query';
import { fetchMarkdownFiles, BlogPost } from '@/services/githubService';

export const useGitHubPosts = () => {
  return useQuery({
    queryKey: ['github-posts'],
    queryFn: fetchMarkdownFiles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useGroupedPosts = () => {
  const { data: posts, ...rest } = useGitHubPosts();
  
  const groupedPosts = posts?.reduce((groups: Record<string, BlogPost[]>, post) => {
    const folder = post.folder;
    if (!groups[folder]) {
      groups[folder] = [];
    }
    groups[folder].push(post);
    return groups;
  }, {}) || {};
  
  return {
    groupedPosts,
    posts,
    ...rest
  };
};
