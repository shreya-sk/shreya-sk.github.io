
import { useState } from "react";
import { Search, ChevronRight, Folder } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { useGroupedPosts } from "@/hooks/useGitHubPosts";

interface DirectoryTree {
  [key: string]: {
    posts: any[];
    subdirs: DirectoryTree;
  };
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { groupedPosts, isLoading, error } = useGroupedPosts();
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // Build hierarchical directory tree
  const buildTree = (posts: Record<string, any[]>): DirectoryTree => {
    const tree: DirectoryTree = {};

    Object.entries(posts).forEach(([folder, folderPosts]) => {
      const parts = folder.split('/');
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = { posts: [], subdirs: {} };
        }

        if (index === parts.length - 1) {
          current[part].posts = folderPosts;
        } else {
          current = current[part].subdirs;
        }
      });
    });

    return tree;
  };

  // Toggle directory expansion
  const toggleDir = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  // Filter posts based on search
  const filteredPosts = Object.entries(groupedPosts).reduce((acc, [folder, posts]) => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length > 0) {
      acc[folder] = filtered;
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
  const tree = buildTree(filteredPosts);
  const topLevelDirs = Object.keys(tree);

  // Recursive component to render directory tree
  const DirectoryNode = ({ name, node, path }: { name: string; node: any; path: string }) => {
    const isExpanded = expandedDirs.has(path);
    const hasSubdirs = Object.keys(node.subdirs).length > 0;
    const hasPosts = node.posts.length > 0;
    const totalItems = (hasSubdirs ? Object.keys(node.subdirs).length : 0) + node.posts.length;

    return (
      <div className="space-y-2">
        <button
          onClick={() => toggleDir(path)}
          className="w-full rounded-2xl p-4 glass-bucket border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
                <img src="/file-icon.jpg" alt="folder" className="h-4 w-4 object-contain" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-white lowercase">
                  {name}
                </h3>
                <p className="text-xs text-white/70">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
              <ChevronRight className="h-5 w-5 text-white/80" />
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="ml-6 space-y-2 animate-in slide-in-from-left-2 duration-300">
            {/* Render subdirectories */}
            {hasSubdirs && Object.entries(node.subdirs).map(([subName, subNode]) => (
              <DirectoryNode
                key={`${path}/${subName}`}
                name={subName}
                node={subNode}
                path={`${path}/${subName}`}
              />
            ))}

            {/* Render posts */}
            {hasPosts && (
              <div className="space-y-2">
                {node.posts.map((post: any) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
              className="w-full pl-10 pr-4 py-2.5 minimal-card border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-3">
          {topLevelDirs.length > 0 ? (
            topLevelDirs.map((dirName) => (
              <DirectoryNode
                key={dirName}
                name={dirName}
                node={tree[dirName]}
                path={dirName}
              />
            ))
          ) : (
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
