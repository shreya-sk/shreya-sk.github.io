import Hero from "@/components/Hero";
import { ArrowRight, BookOpen, Lightbulb, Code, Brain, Sparkles, Target, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "@/components/BlogCard";
import { useGitHubPosts } from "@/hooks/useGitHubPosts";
import { useGists } from "@/hooks/useGists";
import { useTILEntries } from "@/hooks/useTILEntries";

const Index = () => {
  const { data: posts, isLoading } = useGitHubPosts();
  const { data: gists = [] } = useGists();
  const { data: tilEntries = [] } = useTILEntries();
  
  const recentPosts = posts?.slice(0, 2) || [];
  
  const totalPosts = posts?.length || 0;
  const totalGists = gists.length || 0;
  const totalTIL = tilEntries.length || 0;

  return (
    <div className="min-h-screen liquid-gradient">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-12 relative">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-3 gap-4">
              {[
                { count: totalPosts, label: 'posts', icon: BookOpen, color: 'primary', to: '/blog' },
                { count: totalGists, label: 'gists', icon: Code, color: 'accent', to: '/gists' },
                { count: totalTIL, label: 'learnings', icon: Lightbulb, color: 'secondary', to: '/til' },
              ].map(({ count, label, icon: Icon, color, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="group ios-card rounded-2xl p-6 text-center hover-lift"
                >
                  <Icon className={`h-6 w-6 mx-auto mb-3 text-${color}`} />
                  <div className={`text-3xl md:text-4xl font-bold text-${color} mb-1`}>{count}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-muted/30 border border-border/30">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">about me</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  getting to know me
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                DevOps engineer · Design thinker · System builder
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="ios-card rounded-3xl p-8 hover-lift group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Target className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">what I do</h3>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">
                  I'm a DevOps engineer - still learning, always curious.
                  I like understanding systems end-to-end and making them{" "}
                  <span className="font-semibold text-primary">calmer, clearer</span>, and easier to reason about.
                </p>
              </div>

              {/* Card 2 */}
              <div className="ios-card rounded-3xl p-8 hover-lift group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform">
                    <Brain className="h-7 w-7 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary">how I think</h3>
                </div>
                <ul className="space-y-3 text-base text-muted-foreground">
                  {[
                    { text: 'everything needs a system', highlight: 'everything' },
                    { text: 'clarity beats cleverness', highlight: 'clarity' },
                    { text: "if it's messy, I organize it", highlight: 'organize' },
                    { text: "if it's confusing, I map it", highlight: 'map' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-secondary font-bold mt-0.5">→</span>
                      <span>{item.text.replace(item.highlight, '')}<span className="font-semibold text-foreground">{item.highlight}</span></span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3 */}
              <div className="ios-card rounded-3xl p-8 hover-lift group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform">
                    <Heart className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-accent">things I love</h3>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">
                  reading, music, research, making notes, designing workflows,
                  and constantly <span className="font-semibold text-accent">refining</span> how I learn and work.
                </p>
              </div>

              {/* Wide card */}
              <div className="md:col-span-3 ios-card rounded-3xl p-10 hover-lift">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-xl shrink-0">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      why this site exists
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl">
                      This is my <span className="font-bold text-primary">thinking space</span>.
                      A place where I document what I learn, experiment with ideas,
                      and build systems for my own understanding — shared{" "}
                      <span className="font-bold text-secondary">openly, imperfectly</span>, and intentionally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 relative">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">currently learning</h2>
              </div>
              <Link 
                to="/blog"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                view all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-16">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                </div>
                <p className="text-muted-foreground">loading posts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
                {recentPosts.length === 0 && (
                  <div className="col-span-2 text-center py-16 ios-card rounded-3xl">
                    <p className="text-muted-foreground">no posts yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
