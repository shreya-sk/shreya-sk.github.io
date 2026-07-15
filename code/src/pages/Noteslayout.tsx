import { usePageMeta } from '@/hooks/usePageMeta';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PanelLeft, X } from 'lucide-react';
import { useGitHubPosts } from '@/hooks/useGitHubPosts';
import SidebarTree from '@/components/Sidebartree';
import MarkdownRenderer from '@/components/Markdownrenderer';
import { BlogPost } from '@/types/blog';

/**
 * Resolve a wikilink target (e.g. "Learning/DevOps/Docker MOC", "Docker MOC")
 * to a published post. Vault paths keep a "Learning/" prefix that doesn't
 * exist on the site, and links often use just the note name - so we try
 * exact path, then suffix, then bare note-name match.
 */
function resolveNote(posts: BlogPost[], target: string): BlogPost | null {
  const clean = decodeURIComponent(target)
    .replace(/\.md$/i, '')
    .replace(/^Learning\//i, '')
    .toLowerCase();
  const base = clean.split('/').pop() || clean;
  const norm = (p: BlogPost) => p.path.replace(/\.md$/i, '').toLowerCase();
  return (
    posts.find((p) => norm(p) === clean) ||
    posts.find((p) => norm(p).endsWith('/' + clean)) ||
    posts.find((p) => norm(p).split('/').pop() === base) ||
    null
  );
}

const NotesLayout = () => {
  usePageMeta('learning', 'Notes on DevOps, Kubernetes, Docker, Kong and more - synced from an Obsidian vault.');
  const { data: posts = [], isLoading, error } = useGitHubPosts();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [treeOpen, setTreeOpen] = useState(false); // mobile drawer
  const [searchParams, setSearchParams] = useSearchParams();
  const noteParam = searchParams.get('note');

  // Wikilinks and deep links land here as /blog?note=<target>;
  // otherwise fall back to the welcome note.
  useEffect(() => {
    if (!posts.length) return;
    if (noteParam) {
      const match = resolveNote(posts, noteParam);
      if (match) setSelectedPost(match);
    } else if (!selectedPost) {
      const welcome =
        posts.find((p) => p.path.toLowerCase().includes('hey, there')) || posts[0];
      setSelectedPost(welcome);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, noteParam]);

  const selectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setTreeOpen(false); // close drawer after picking on mobile
    setSearchParams({ note: post.path.replace(/\.md$/i, '') }); // deep-linkable URL
  };

  if (isLoading) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-mono">loading your notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <div className="text-center space-y-2 max-w-md px-4">
          <h2 className="text-xl font-extrabold uppercase tracking-tighter">Failed to load notes</h2>
          <p className="text-muted-foreground text-sm font-mono">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sage-gradient">
      <div className="px-2 py-2 md:px-4 md:py-4 h-[calc(100vh-4rem)]">
        <div className="relative h-full liquid-glass-content overflow-hidden flex flex-col md:flex-row">
          {/* Mobile top bar: toggle the notes tree */}
          <div className="md:hidden flex items-center gap-2 px-3 py-2.5 border-b-2 border-foreground/90 shrink-0">
            <button
              onClick={() => setTreeOpen((v) => !v)}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide hover:text-accent transition-colors"
              aria-label="Toggle notes tree"
            >
              {treeOpen ? <X className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
              notes
            </button>
            {selectedPost && !treeOpen && (
              <span className="font-mono text-xs text-muted-foreground truncate">
                / {selectedPost.title}
              </span>
            )}
          </div>

          {/* Tree: drawer on mobile, fixed column on desktop */}
          <aside
            className={`
              ${treeOpen ? 'block' : 'hidden'} md:block
              w-full md:w-[300px] shrink-0 overflow-y-auto
              border-b-2 md:border-b-0 md:border-r border-foreground/20
              max-h-[50vh] md:max-h-none
            `}
          >
            <SidebarTree
              posts={posts}
              selectedPath={selectedPost?.path || null}
              onFileSelect={selectPost}
            />
          </aside>

          {/* Note content */}
          <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-8 py-6">
            <div className="max-w-3xl mx-auto">
              <MarkdownRenderer post={selectedPost} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotesLayout;
