import { usePageMeta } from "@/hooks/usePageMeta";
import Hero from "@/components/Hero";
import NowBar from "@/components/NowBar";

const BUILT: Array<[string, string, string]> = [
  ["01", "Migrated production workloads from VMware Tanzu to Kubernetes", "sonic · current"],
  ["02", "Reusable Helm & Ansible deployment patterns for release pipelines", "sonic · current"],
  ["03", "CI/CD & release management across teams - Azure DevOps, Octopus, Ansible", "sonic · current"],
  ["04", "This website - a two-way Obsidian ↔ GitHub sync pipeline with a client-side git editor in the browser", "2026"],
  ["05", "Airtable operations system for a multi-site education business", "ongoing"],
  ["06", "Research in Aspect-Based Sentiment Analysis (NLP)", "2024"],
];

const Index = () => {
  usePageMeta(undefined, "Shreya's digital diary - DevOps notes, TIL log, gists and more.");

  return (
    <div className="min-h-screen sage-gradient">
      <Hero />

      <section className="py-16 md:py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
            {/* ---- main column ---- */}
            <div>
              {/* 01 / Profile */}
              <div className="mb-14">
                <div className="mb-12 flex items-baseline justify-between">
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
                      I'm a DevOps Engineer working with <strong className="font-semibold">Kubernetes, Docker, Azure DevOps, Ansible</strong> and
                      platform tooling. I like understanding how things fit together end-to-end, then making them <strong className="font-semibold">calmer, clearer</strong>, and easier to reason about.
                    </p>
                  </div>

                  <div className="py-8 md:py-0 md:px-8 border-b md:border-b-0 md:border-r border-foreground/20">
                    <div className="font-mono text-[11px] uppercase tracking-wide text-accent mb-3">how I think</div>
                    <ul className="space-y-2.5 text-base text-foreground/90">
                      <li className="flex items-start gap-2"><span className="text-accent">·</span><span>everything needs a system</span></li>
                      <li className="flex items-start gap-2"><span className="text-accent">·</span><span>clarity beats cleverness</span></li>
                      <li className="flex items-start gap-2"><span className="text-accent">·</span><span>if it's messy, I organize it</span></li>
                      <li className="flex items-start gap-2"><span className="text-accent">·</span><span>if it's confusing, I map it</span></li>
                    </ul>
                  </div>

                  <div className="pt-8 md:pt-0 md:pl-8">
                    <div className="font-mono text-[11px] uppercase tracking-wide text-accent mb-3">outside work</div>
                    <ul className="space-y-2.5 text-base text-foreground/90">
                      <li className="flex items-start gap-2"><span className="text-accent">·</span><span>pilates instructor</span></li>
                      <li className="flex items-start gap-2"><span className="text-accent">·</span><span>half-marathon training</span></li>
                      <li className="flex items-start gap-2"><span className="text-accent">·</span><span>weekend STEM educator</span></li>
                      <li className="flex items-start gap-2"><span className="text-accent">·</span><span>documenting absolutely everything</span></li>
                    </ul>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-foreground/20">
                  <div className="font-mono text-[11px] uppercase tracking-wide text-accent mb-3">why this site exists</div>
                  <p className="text-xl leading-relaxed max-w-3xl">
                    This is my <strong className="font-semibold">public notebook</strong> - a place to document
                    what I learn, explore ideas, and untangle complex things.
                  </p>
                </div>
              </div>

              {/* 02 / Impact */}
              <div>
                <div className="mb-10 flex items-baseline justify-between">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold uppercase tracking-tighter whitespace-nowrap">
                    things I've built
                  </h2>
                  <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground hidden md:block">
                    02 / Impact
                  </span>
                </div>

                <div className="border-t border-foreground/20">
                  {BUILT.map(([n, item, tag]) => (
                    <div
                      key={n}
                      className="flex items-baseline gap-4 py-4 border-b border-foreground/20"
                    >
                      <span className="font-mono text-xs text-accent shrink-0">{n}</span>
                      <span className="text-base leading-relaxed flex-1">{item}</span>
                      <span
                        className={`font-mono text-[11px] uppercase tracking-wide shrink-0 ${
                          tag.includes('current') ? 'text-accent' : 'text-muted-foreground'
                        }`}
                      >
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- floating now bar ---- */}
            <NowBar />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
