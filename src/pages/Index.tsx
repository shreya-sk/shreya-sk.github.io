import Hero from "@/components/Hero";
import { ArrowRight, BookOpen, Lightbulb, Code } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "@/components/BlogCard";
import TILCard from "@/components/TILCard";
import { useGitHubPosts } from "@/hooks/useGitHubPosts";
import { useGists } from "@/hooks/useGists";

// Mock data for TIL section
const recentTIL = [
  {
    id: "1",
    content: "discovered CSS subgrid is finally supported everywhere. makes nested grids so much easier - no more hacky workarounds for alignment.",
    date: "2024-01-16",
  },
  {
    id: "2",
    content: "learned the hard way: server components can't use useState. need to add 'use client' directive when you need interactivity.",
    date: "2024-01-15",
  }
];

const Index = () => {
  const { data: posts, isLoading } = useGitHubPosts();
  const { data: gists = [] } = useGists();
  
  // Get the first 4 posts for recent posts section (2x2 grid)
  const recentPosts = posts?.slice(0, 4) || [];
  
  // Calculate real stats
  const totalPosts = posts?.length || 0;
  const totalGists = gists.length || 0;
  const totalTIL = 200; // You can make this dynamic if you have TIL data

  return (
    <div className="min-h-screen sage-gradient">
      <Hero />
      
      {/* Horizontal Stats Section */}
      <section className="py-8 bg-background/40 backdrop-blur-sm">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex justify-around items-center gap-4">
              <Link to="/blog" className="stat-card group">
                <BookOpen className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-light text-primary">{totalPosts}</div>
                <div className="text-xs text-muted-foreground">posts</div>
              </Link>
              
              <Link to="/gists" className="stat-card group">
                <Code className="h-5 w-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-light text-accent">{totalGists}</div>
                <div className="text-xs text-muted-foreground">gists</div>
              </Link>
              
              <Link to="/til" className="stat-card group">
                <Lightbulb className="h-5 w-5 text-secondary mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-light text-secondary">{totalTIL}+</div>
                <div className="text-xs text-muted-foreground">learnings</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Blog Posts Section - Compact Grid */}
      <section className="py-12 bg-background/40 backdrop-blur-sm">
        <div className="container px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary/80" />
                <h2 className="text-xl font-medium tracking-tight">recent posts</h2>
              </div>
              <Link 
                to="/blog"
                className="inline-flex items-center text-sm text-primary/80 hover:text-primary transition-colors font-medium"
              >
                view all
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 mx-auto mb-4"></div>
                <p className="text-muted-foreground text-sm font-light">loading posts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
                {recentPosts.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground text-sm font-light">no posts yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Recent TIL Section - Journal Style */}
      <section className="py-12">
        <div className="container px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-secondary/80" />
                <h2 className="text-xl font-medium tracking-tight">daily journal</h2>
              </div>
              <Link 
                to="/til"
                className="inline-flex items-center text-sm text-secondary/80 hover:text-secondary transition-colors font-medium"
              >
                view all
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTIL.map((item) => (
                <TILCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
