import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative sage-gradient border-b-2 border-foreground/90 py-16 md:py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-end gap-8 md:gap-14">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src="/profile.png"
                alt="Shreya"
                className="w-32 h-32 md:w-44 md:h-44 rounded-none object-cover"
              />
              <div className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <span className="text-accent">●</span> synced from obsidian
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-4 text-5xl md:text-7xl font-extrabold uppercase tracking-tighter leading-[0.95]">
                mostly by
                <br />
                shreya<span className="text-accent">;</span>
              </h1>

              <p className="mb-8 font-mono text-sm max-w-xl mx-auto md:mx-0 text-muted-foreground">
                an organised corner of an otherwise overflowing brain.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
                <Link
                  to="/blog"
                  className="glass-button sage inline-flex items-center justify-center px-5 py-2.5 text-sm font-extrabold uppercase"
                >
                  currently learning
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/til"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-extrabold uppercase border border-foreground/90 text-foreground hover:text-accent hover:border-accent transition-colors"
                >
                  today i learned
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
