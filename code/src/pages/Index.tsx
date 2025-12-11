import Hero from "@/components/Hero";
import { ArrowRight, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "@/components/BlogCard";
import TILCard from "@/components/TILCard";
import { useGitHubPosts } from "@/hooks/useGitHubPosts";
import { useGists } from "@/hooks/useGists";
import { useTILEntries } from "@/hooks/useTILEntries";

const Index = () => {
  const { data: posts, isLoading } = useGitHubPosts();
  const { data: gists = [] } = useGists();
  const { data: tilEntries = [] } = useTILEntries();
  
  // Get the first 4 posts for recent posts section (2x2 grid)
  const recentPosts = posts?.slice(0, 2) || [];
  
  // Get the first 2 TIL entries for the home page
  const recentTIL = tilEntries.slice(0, 2);
  
  // Calculate real stats
  const totalPosts = posts?.length || 0;
  const totalGists = gists.length || 0;
  const totalTIL = tilEntries.length || 0;

  return (
    <div className="min-h-screen sage-gradient">
      <Hero />
      
      {/* Recent Blog Posts Section - Compact Grid */}
      <section className="py-12 bg-background/40 backdrop-blur-sm">
        <div className="container px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary/80" />
                <h2 className="text-xl font-medium tracking-tight">currently learning</h2>
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
                <h2 className="text-xl font-medium tracking-tight">today i learned</h2>
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
              {recentTIL.length > 0 ? (
                recentTIL.map((item) => (
                  <TILCard key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-muted-foreground text-sm font-light">no journal entries yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Compact Stats Section at Bottom */}
      <section className="py-6 bg-background/60 backdrop-blur-sm border-t border-border/30">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex justify-center items-center gap-8">
              <Link to="/blog" className="stat-card-compact group">
                <div className="text-2xl font-light text-primary">{totalPosts}</div>
                <div className="text-xs text-muted-foreground">posts</div>
              </Link>
              
              <Link to="/gists" className="stat-card-compact group">
                <div className="text-2xl font-light text-accent">{totalGists}</div>
                <div className="text-xs text-muted-foreground">gists</div>
              </Link>
              
              <Link to="/til" className="stat-card-compact group">
                <div className="text-2xl font-light text-secondary">{totalTIL}</div>
                <div className="text-xs text-muted-foreground">learnings</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
