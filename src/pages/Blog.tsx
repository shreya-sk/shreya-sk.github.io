
import { useState } from "react";
import { Search, ChevronDown, FileText } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { useGroupedPosts } from "@/hooks/useGitHubPosts";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { groupedPosts, isLoading, error } = useGroupedPosts();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Toggle folder expansion
  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  // Filter posts based on search term
  const filteredGroups = Object.entries(groupedPosts).reduce((acc, [folder, posts]) => {
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredPosts.length > 0) {
      acc[folder] = filteredPosts;
    }

    return acc;
  }, {} as Record<string, typeof groupedPosts[string]>);

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts from your Obsidian vault...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load posts from GitHub</p>
            <p className="text-muted-foreground text-sm">Please check your internet connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPosts = Object.values(groupedPosts).flat().length;

  return (
    <div className="container px-4 py-8 sage-gradient min-h-screen">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">shreya's knowledge hub</h1>
          <p className="text-foreground/60 text-sm mb-6">
            {totalPosts} notes from obsidian vault
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 h-4 w-4" />
            <input
              type="text"
              placeholder="search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 minimal-card border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(filteredGroups).map(([folder, posts]) => {
            const isExpanded = expandedFolders.has(folder);

            return (
              <div key={folder} className="minimal-card rounded-3xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300">
                {/* Folder Header - Clickable */}
                <button
                  onClick={() => toggleFolder(folder)}
                  className="w-full p-5 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 backdrop-blur-sm flex items-center justify-between group cursor-pointer transition-all hover:shadow-lg hover:from-primary/10 hover:via-secondary/10 hover:to-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-secondary/20">
                      <FileText className="h-5 w-5 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent lowercase">
                        {folder}
                      </h2>
                      <p className="text-xs text-foreground/50">
                        {posts.length} {posts.length === 1 ? 'note' : 'notes'}
                      </p>
                    </div>
                  </div>

                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                    <ChevronDown className="h-5 w-5 text-primary/60" />
                  </div>
                </button>

                {/* Posts List - Expandable */}
                {isExpanded && (
                  <div className="p-4 bg-white/50 space-y-3 animate-in slide-in-from-top-2">
                    {posts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {Object.keys(filteredGroups).length === 0 && (
            <div className="text-center py-16 minimal-card rounded-3xl">
              <p className="text-foreground/60 text-sm">no notes found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
