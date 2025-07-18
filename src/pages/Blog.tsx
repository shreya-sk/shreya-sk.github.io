
import { useState } from "react";
import { Search, Folder, FileText } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { useGroupedPosts } from "@/hooks/useGitHubPosts";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { groupedPosts, isLoading, error } = useGroupedPosts();
  
  // Filter posts based on search term and selected folder
  const filteredGroups = Object.entries(groupedPosts).reduce((acc, [folder, posts]) => {
    if (selectedFolder && folder !== selectedFolder) {
      return acc;
    }
    
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
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Knowledge Hub</h1>
          <p className="text-muted-foreground text-lg mb-6">
            {totalPosts} posts synced from your Obsidian vault. Organized by folders for easy navigation.
          </p>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            
            {/* Folder Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                  !selectedFolder 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <FileText className="w-3 h-3 mr-1" />
                All Folders
              </button>
              {Object.keys(groupedPosts).map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedFolder === folder 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Folder className="w-3 h-3 mr-1" />
                  {folder} ({groupedPosts[folder].length})
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {Object.entries(filteredGroups).map(([folder, posts]) => (
            <div key={folder} className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Folder className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{folder}</h2>
                <span className="text-sm text-muted-foreground">({posts.length} posts)</span>
              </div>
              
              <div className="grid gap-4">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(filteredGroups).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
