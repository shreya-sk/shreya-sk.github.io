import { usePageMeta } from "@/hooks/usePageMeta";
import Hero from "@/components/Hero";
import NowBar from "@/components/NowBar";

const Index = () => {
  usePageMeta(undefined, "Shreya's digital diary - DevOps notes, TIL log, and more.");

  return (
    <div className="min-h-screen sage-gradient">
      <Hero />

      <section className="py-16 md:py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
              {/* ---- main column ---- */}
              <div>
                {/* 01 / Profile */}
                <div>
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
                        platform tooling. No two systems are designed the same way, so I document as I go - the more I map, the easier the next one gets.
                      </p>
                    </div>

                    <div className="py-8 md:py-0 md:px-8 border-b md:border-b-0 md:border-r border-foreground/20">
                      <div className="font-mono text-[11px] uppercase tracking-wide text-accent mb-3">how I think</div>
                      <ul className="space-y-2.5 text-base text-foreground/90">
                        <li className="flex items-start gap-2"><span className="text-accent">·</span><span>everything needs a system</span></li>
                        <li className="flex items-start gap-2"><span className="text-accent">·</span><span>no two systems are designed the same way</span></li>
                        <li className="flex items-start gap-2"><span className="text-accent">·</span><span>so I map as I learn</span></li>
                        <li className="flex items-start gap-2"><span className="text-accent">·</span><span>I document so I don't have to relearn</span></li>
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
                      what I learn, explore ideas, and untangle complicated things.
                    </p>
                  </div>
                </div>
              </div>

              {/* ---- floating now bar ---- */}
              <NowBar />
            </div>

            {/* closing note - full width, centered on the whole page */}
            <div className="mt-10 text-center">
              <p className="font-mono text-sm text-muted-foreground">
                same creative instinct, whether it's a studio or a cluster.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
