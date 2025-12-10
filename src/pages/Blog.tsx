import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NoteSidebar from "@/components/NoteSidebar";
import MarkdownViewer from "@/components/MarkdownViewer";
import { BlogPost, fetchMarkdownFiles } from "@/services/githubService";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await fetchMarkdownFiles();
        setPosts(fetchedPosts);

        // Load first post if no default found
        if (fetchedPosts.length > 0) {
          // Try to find "Hey, there!" post
          const defaultPost = fetchedPosts.find(post =>
            post.title.toLowerCase().includes('hey') && post.title.toLowerCase().includes('there')
          );
          setSelectedPost(defaultPost || fetchedPosts[0]);
        }
      } catch (err) {
        console.error("Error loading posts:", err);
        setError("Failed to load posts from GitHub");
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  if (isLoading) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your knowledge hub...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load posts from GitHub</p>
          <p className="text-muted-foreground text-sm">Please check your internet connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sage-gradient">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 minimal-card border-b border-primary/10 backdrop-blur-lg">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            shreya's knowledge hub
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-screen pt-16 lg:pt-0 p-0 lg:p-4 gap-4">
        {/* Left Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-80 h-full bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden ios-glass">
          <div className="p-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              shreya's knowledge hub
            </h1>
            <p className="text-xs text-foreground/50 mt-1">
              {posts.length} notes from obsidian
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <NoteSidebar
              posts={posts}
              selectedPost={selectedPost}
              onSelectPost={handleSelectPost}
            />
          </div>
        </aside>

        {/* Left Sidebar - Mobile */}
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar */}
            <aside className="lg:hidden fixed left-4 top-20 bottom-4 w-80 max-w-[85vw] bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 z-50 animate-in slide-in-from-left duration-300 overflow-hidden ios-glass">
              <div className="p-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                <p className="text-xs text-foreground/50">
                  {posts.length} notes from obsidian
                </p>
              </div>
              <div className="h-[calc(100%-4rem)] overflow-hidden">
                <NoteSidebar
                  posts={posts}
                  selectedPost={selectedPost}
                  onSelectPost={handleSelectPost}
                />
              </div>
            </aside>
          </>
        )}

        {/* Right Content Area */}
        <main className="flex-1 overflow-hidden">
          <MarkdownViewer post={selectedPost} />
        </main>
      </div>
    </div>
  );
};

export default Blog;
