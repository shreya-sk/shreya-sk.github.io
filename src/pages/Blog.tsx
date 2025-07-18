
import { useState } from "react";
import { Search } from "lucide-react";
import BlogCard from "@/components/BlogCard";

// Mock data - this will be replaced with actual markdown file parsing
const mockPosts = [
  {
    id: "1",
    title: "Building a Second Brain with Obsidian",
    excerpt: "How I use Obsidian to capture, organize, and develop my thoughts into a comprehensive knowledge management system.",
    date: "2024-01-15",
    readTime: "5 min read",
    slug: "building-second-brain-obsidian"
  },
  {
    id: "2",
    title: "The Power of Linked Thinking",
    excerpt: "Exploring how connecting ideas through bidirectional links creates a more dynamic and discoverable knowledge base.",
    date: "2024-01-12",
    readTime: "3 min read",
    slug: "power-of-linked-thinking"
  },
  {
    id: "3",
    title: "From Notes to Insights",
    excerpt: "A systematic approach to transforming raw information into actionable insights through progressive summarization.",
    date: "2024-01-08",
    readTime: "7 min read",
    slug: "notes-to-insights"
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPosts = mockPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Thoughts, insights, and deep dives into various topics. All content is automatically synced from my Obsidian vault.
          </p>
          
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
        </div>
        
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
          
          {filteredPosts.length === 0 && (
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
