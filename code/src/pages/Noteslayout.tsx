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
      <div className="h-screen px-4 py-4">
        {/* Single unified glass surface */}
        <div className="relative h-full liquid-glass-content rounded-3xl overflow-hidden shadow-2xl">
          {/* Dynamic pill floating on the left side of the surface */}
          <aside className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
            <div className="liquid-glass-pill rounded-3xl overflow-hidden shadow-2xl">
              <SidebarTree
                posts={posts}
                selectedPath={selectedPost?.path || null}
                onFileSelect={setSelectedPost}
              />
            </div>
          </aside>

          {/* Markdown content - takes full surface */}
          <main className="h-full overflow-y-auto px-8 py-8">
            <div className="max-w-4xl mx-auto">
              <MarkdownRenderer post={selectedPost} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotesLayout;
