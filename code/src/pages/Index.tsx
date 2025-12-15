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
      

    <section className="py-20 relative">
  <div className="container px-6">
    <div className="mx-auto max-w-6xl">

      {/* Bold Header */}
      <div className="mb-16 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          getting to know me
        </h2>
        <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
          DevOps engineer · Design thinker · System builder
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Card 1 - Vibrant Primary */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 border border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-bold text-primary">what I do</h3>
            </div>
            <p className="text-base leading-relaxed text-foreground/80">
              I'm a DevOps engineer - still learning, always curious.
              I like understanding systems end-to-end and making them <span className="font-semibold text-primary">calmer, clearer</span>, and easier to reason about.
            </p>
          </div>
        </div>

        {/* Card 2 - Vibrant Secondary */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-secondary/20 hover:-translate-y-1 transition-all duration-300 border border-secondary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg shadow-secondary/30">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-secondary">how I think</h3>
            </div>
            <ul className="space-y-3 text-base text-foreground/80">
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">→</span>
                <span><span className="font-semibold text-foreground">everything</span> needs a system</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">→</span>
                <span><span className="font-semibold text-secondary">clarity</span> beats cleverness</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">→</span>
                <span>if it's messy, I <span className="font-semibold text-foreground">organize</span> it</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">→</span>
                <span>if it's confusing, I <span className="font-semibold text-foreground">map</span> it</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 3 - Vibrant Accent */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 border border-accent/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-accent">things I love</h3>
            </div>
            <p className="text-base leading-relaxed text-foreground/80">
              reading, music, research, making notes, designing workflows,
              and constantly <span className="font-semibold text-accent">refining</span> how I learn and work.
            </p>
          </div>
        </div>

        {/* Wide card - Bold Statement */}
        <div className="md:col-span-3 group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-primary/20">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-xl shrink-0">
                <span className="text-3xl">💭</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  why this site exists
                </h3>
                <p className="text-lg leading-relaxed text-foreground/80 max-w-3xl">
                  This is my <span className="font-bold text-primary">thinking space</span>.
                  A place where I document what I learn, experiment with ideas,
                  and build systems for my own understanding — shared <span className="font-bold text-secondary">openly, imperfectly</span>, and intentionally.
                </p>
              </div>
            </div>
          </div>
        </div>

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
