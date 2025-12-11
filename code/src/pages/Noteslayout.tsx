import { useState, useEffect } from 'react';
import { useGitHubPosts } from '@/hooks/useGitHubPosts';
import SidebarTree from '@/components/SidebarTree';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BlogPost } from '@/services/githubService';

const NotesLayout = () => {
  const { data: posts = [], isLoading, error } = useGitHubPosts();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Find and set "Hey, there!" as default on load
  useEffect(() => {
    if (posts.length > 0 && !selectedPost) {
      // Look for "Hey, there!" file (case-insensitive)
      const defaultPost = posts.find(
        (post) =>
          post.title.toLowerCase().includes('hey') ||
          post.path.toLowerCase().includes('hey, there')
      );

      if (defaultPost) {
        setSelectedPost(defaultPost);
      } else {
        // Fallback to first post if "Hey, there!" doesn't exist
        setSelectedPost(posts[0]);
      }
    }
  }, [posts, selectedPost]);

  if (isLoading) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground/60 text-sm">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground">Failed to load notes</h2>
          <p className="text-foreground/60 text-sm">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sage-gradient">
      <div className="container mx-auto px-4 py-6 h-screen flex gap-6">
        {/* Left Sidebar - Glass Directory Tree */}
        <aside className="w-80 flex-shrink-0">
          <div className="h-full liquid-glass-sidebar rounded-3xl overflow-hidden shadow-2xl">
            <SidebarTree
              posts={posts}
              selectedPath={selectedPost?.path || null}
              onFileSelect={setSelectedPost}
            />
          </div>
        </aside>

        {/* Right Content Area - Markdown Viewer */}
        <main className="flex-1 min-w-0">
          <div className="h-full liquid-glass-content rounded-3xl overflow-hidden shadow-2xl">
            <MarkdownRenderer post={selectedPost} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotesLayout;
