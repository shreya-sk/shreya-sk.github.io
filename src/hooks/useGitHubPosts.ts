import { useQuery } from '@tanstack/react-query';
import { getAllMarkdownFiles, MarkdownFile } from '@/services/localMarkdownService';
import { BlogPost } from '@/types/blog';

// Transform MarkdownFile to BlogPost format
const transformToPost = (file: MarkdownFile): BlogPost => ({
  id: file.slug,
  title: file.title,
  content: file.content,
  path: file.path,
  folder: file.category || 'Root',
  date: new Date().toISOString().split('T')[0],
  slug: file.slug
});

export const useGitHubPosts = () => {
  return useQuery({
    queryKey: ['local-posts'],
    queryFn: async () => {
      const files = await getAllMarkdownFiles();
      // Filter out TIL entries
      return files
        .filter(f => !f.path.startsWith('Daily - TIL/'))
        .map(transformToPost);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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

// Re-export BlogPost for backward compatibility
export type { BlogPost };
