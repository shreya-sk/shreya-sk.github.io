
import Hero from "@/components/Hero";
import { ArrowRight, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "@/components/BlogCard";
import TILCard from "@/components/TILCard";
import { useGitHubPosts } from "@/hooks/useGitHubPosts";

// Mock data for TIL section
const recentTIL = [
  {
    id: "1",
    title: "CSS Grid subgrid is finally here",
    content: "Learned that CSS subgrid is now supported in all major browsers. It allows grid items to participate in the grid of their parent, making complex layouts much easier to achieve.",
    date: "2024-01-16",
    tags: ["CSS", "Web Development", "Grid"]
  },
  {
    id: "2",
    title: "React Server Components can't use useState",
    content: "Server Components run on the server and can't maintain client-side state. If you need state, you have to use a Client Component by adding 'use client' directive.",
    date: "2024-01-15",
    tags: ["React", "Server Components", "Next.js"]
  }
];

const Index = () => {
  const { data: posts, isLoading } = useGitHubPosts();
  
  // Get the first 2 posts for recent posts section
  const recentPosts = posts?.slice(0, 2) || [];

  return (
    <div className="min-h-screen sage-gradient">
      <Hero />
      
      {/* Recent Blog Posts Section */}
      <section className="py-20 bg-background/40 backdrop-blur-sm">
        <div className="container px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <BookOpen className="h-6 w-6 text-primary/80" />
                <h2 className="text-3xl font-medium tracking-tight">Recent Posts</h2>
              </div>
              <Link 
                to="/blog"
                className="inline-flex items-center text-primary/80 hover:text-primary transition-colors font-medium"
              >
                View all posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 mx-auto mb-6"></div>
                <p className="text-muted-foreground font-light">Loading posts from your Obsidian vault...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {recentPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
                {recentPosts.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground font-light">No posts found. Make sure your GitHub repository contains markdown files.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Recent TIL Section */}
      <section className="py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <Lightbulb className="h-6 w-6 text-yellow-500/80" />
                <h2 className="text-3xl font-medium tracking-tight">Today I Learned</h2>
              </div>
              <Link 
                to="/til"
                className="inline-flex items-center text-primary/80 hover:text-primary transition-colors font-medium"
              >
                View all learnings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recentTIL.map((item) => (
                <TILCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-background/40 backdrop-blur-sm">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-3">
                <div className="text-4xl font-light text-primary">{posts?.length || 0}</div>
                <div className="text-muted-foreground font-light">Blog Posts</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-light text-primary">200+</div>
                <div className="text-muted-foreground font-light">TIL Entries</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-light text-primary">1k+</div>
                <div className="text-muted-foreground font-light">Connected Notes</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
