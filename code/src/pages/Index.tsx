import { usePageMeta } from "@/hooks/usePageMeta";
import Hero from "@/components/Hero";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "@/components/BlogCard";
import { useGitHubPosts } from "@/hooks/useGitHubPosts";
import { useGists } from "@/hooks/useGists";
import { useTILEntries } from "@/hooks/useTILEntries";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/services/localMarkdownService";

const Index = () => {
  usePageMeta(undefined, "Shreya's digital garden — DevOps notes, TIL log, gists and more.");
  const { data: posts, isLoading } = useGitHubPosts();
  const { data: gists = [] } = useGists();
  const { data: tilEntries = [] } = useTILEntries();
  // "currently on" = most recently worked-on notes (via recent.json from vault sync)
  const { data: recentPosts = [] } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: () => fetchRecentPosts(2),
    staleTime: 5 * 60 * 1000,
  });

  const totalPosts = posts?.length || 0;
  const totalGists = gists.length || 0;
  const totalTIL = tilEntries.length || 0;

  return (
    <div className="min-h-screen sage-gradient">
      <Hero />

      <section className="py-20 border-b-2 border-foreground/90">
        <div className="container px-6">
          <div className="mx-auto max-w-6xl">

            <div className="mb-16 flex items-baseline justify-between">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold uppercase tracking-tighter whitespace-nowrap">
                getting to know me
              </h2>
              <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground hidden md:block">
                01 / Profile
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="pb-8 md:pb-0 md:pr-8 border-b md:border-b-0 md:border-r border-foreground/20">
                <div className="font-mono text-[11px] uppercase tracking-wide text-accent mb-3">what I do</div>
                <p className="text-base leading-relaxed text-foreground/90">
                  I'm a DevOps engineer — still learning, always curious.
                  I like understanding systems end-to-end and making them <strong className="font-semibold">calmer, clearer</strong>, and easier to reason about.
                </p>
              </div>

              <div className="py-8 md:py-0 md:px-8 border-b md:border-b-0 md:border-r border-foreground/20">
                <div className="font-mono text-[11px] uppercase tracking-wide text-accent mb-3">how I think</div>
                <ul className="space-y-2.5 text-base text-foreground/90">
                  <li className="flex items-start gap-2"><span className="text-accent">—</span><span>everything needs a system</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent">—</span><span>clarity beats cleverness</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent">—</span><span>if it's messy, I organize it</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent">—</span><span>if it's confusing, I map it</span></li>
                </ul>
              </div>

              <div className="pt-8 md:pt-0 md:pl-8">
                <div className="font-mono text-[11px] uppercase tracking-wide text-accent mb-3">things I love</div>
                <p className="text-base leading-relaxed text-foreground/90">
                  reading, music, research, making notes, designing workflows,
                  and constantly refining how I learn and work.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-foreground/20">
              <div className="font-mono text-[11px] uppercase tracking-wide text-accent mb-3">why this site exists</div>
              <p className="text-xl leading-relaxed max-w-3xl">
                This is my <strong className="font-semibold">thinking space</strong>.
                A place where I document what I learn, experiment with ideas,
                and build systems for my own understanding — shared <strong className="font-semibold">openly, imperfectly</strong>, and intentionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-14 border-b-2 border-foreground/90">
        <div className="container px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-extrabold uppercase tracking-tight">currently on</h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center font-mono text-xs uppercase tracking-wide text-foreground hover:text-accent transition-colors"
              >
                view all
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm font-mono">loading posts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-foreground/20">
                {recentPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
                {recentPosts.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground text-sm font-mono">no posts yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-8">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl flex justify-center items-stretch">
            <Link to="/blog" className="stat-card-compact group">
              <div className="text-3xl font-mono font-bold">{totalPosts}</div>
              <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">posts</div>
            </Link>
            <Link to="/gists" className="stat-card-compact group">
              <div className="text-3xl font-mono font-bold">{totalGists}</div>
              <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">gists</div>
            </Link>
            <Link to="/til" className="stat-card-compact group">
              <div className="text-3xl font-mono font-bold">{totalTIL}</div>
              <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">learnings</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
