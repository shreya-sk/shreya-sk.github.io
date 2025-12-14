import Hero from "@/components/Hero";
import { ArrowRight, BookOpen, Lightbulb, Briefcase, Brain, Heart, FileText } from "lucide-react";
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

    <section className="py-16 relative overflow-hidden">
  <div className="container px-6">
    <div className="mx-auto max-w-5xl">

      {/* Header with gradient */}
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/10 backdrop-blur-sm">
          <Lightbulb className="h-5 w-5 text-secondary" />
        </div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
          getting to know me
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Card 1 - What I do */}
        <div className="minimal-card rounded-3xl p-6 space-y-4 hover:shadow-xl transition-all duration-300 group border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
              what I do
            </p>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            I'm a DevOps engineer - still learning, always curious.
            I like understanding systems end-to-end and making them <span className="text-primary font-medium">calmer, clearer</span>, and easier to reason about.
          </p>
        </div>

        {/* Card 2 - How I think */}
        <div className="minimal-card rounded-3xl p-6 space-y-4 hover:shadow-xl transition-all duration-300 group border border-secondary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary/70">
              how I think
            </p>
          </div>
          <ul className="text-sm space-y-2.5 text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-secondary mt-0.5">→</span>
              <span>everything needs a system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary mt-0.5">→</span>
              <span><span className="font-medium text-secondary">clarity</span> beats cleverness</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary mt-0.5">→</span>
              <span>if it's messy, I want to organise it</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary mt-0.5">→</span>
              <span>if it's confusing, I want to map it</span>
            </li>
          </ul>
        </div>

        {/* Card 3 - Things I love */}
        <div className="minimal-card rounded-3xl p-6 space-y-4 hover:shadow-xl transition-all duration-300 group border border-accent/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10">
              <Heart className="h-4 w-4 text-accent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent/70">
              things I love
            </p>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            reading, music, research, making notes, designing workflows,
            and constantly <span className="text-accent font-medium">refining</span> how I learn and work.
          </p>
        </div>

        {/* Wide card - Why this site exists */}
        <div className="md:col-span-3 minimal-card rounded-3xl p-8 border border-primary/10 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-background/95 to-background/80">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary/70">
                why this site exists
              </p>
              <p className="text-base leading-relaxed text-foreground/80 max-w-3xl">
                This is my <span className="text-primary font-medium">thinking space</span>.
                A place where I document what I learn, experiment with ideas,
                and build systems for my own understanding — shared <span className="text-secondary font-medium">openly, imperfectly</span>, and intentionally.
              </p>
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
