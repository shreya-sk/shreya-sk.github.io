import { useState } from 'react';
import { useGitHubPosts } from '@/hooks/useGitHubPosts';
import SidebarTree from '@/components/Sidebartree';
import MarkdownRenderer from '@/components/Markdownrenderer';
import { BlogPost } from '@/services/githubService';

const NotesLayout = () => {
  const { data: posts = [], isLoading, error } = useGitHubPosts();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Default selection is now handled by SidebarTree component

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
      <div className="h-screen flex gap-4 px-4 py-4">
        {/* Left Sidebar - Glass Directory Tree with dynamic width */}
        <aside className="flex-shrink-0">
          <div className="h-full liquid-glass-sidebar rounded-3xl overflow-hidden shadow-2xl">
            <SidebarTree
              posts={posts}
              selectedPath={selectedPost?.path || null}
              onFileSelect={setSelectedPost}
            />
          </div>
        </aside>

          {/* Markdown Content - Full width with left padding for sidebar space */}
          <main className="h-full" style={{ paddingLeft: '240px' }}>
            <div className="h-full liquid-glass-content rounded-3xl overflow-hidden shadow-2xl">
              <MarkdownRenderer post={selectedPost} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotesLayout;
