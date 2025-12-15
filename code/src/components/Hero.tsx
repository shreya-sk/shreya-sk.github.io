import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="glow-orb glow-orb-primary w-[500px] h-[500px] -top-40 -left-40" style={{ animationDelay: '0s' }}></div>
      <div className="glow-orb glow-orb-secondary w-[400px] h-[400px] top-1/3 -right-32" style={{ animationDelay: '2s' }}></div>
      <div className="glow-orb glow-orb-accent w-[300px] h-[300px] bottom-20 left-1/4" style={{ animationDelay: '4s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full ios-card border border-primary/30 animate-float-gentle">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">synced from obsidian</span>
          </div>

          {/* Profile with glowing ring */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-2xl opacity-50 animate-pulse scale-110"></div>
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-r from-primary via-secondary to-accent">
                <img
                  src="/profile.png"
                  alt="Shreya"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/50"></div>
            </div>
          </div>

          {/* Main heading with gradient */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">mostly by</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
              shreya;
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            an organised corner of an otherwise{" "}
            <span className="text-foreground font-medium">overflowing brain</span>
          </p>
      
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link
              to="/blog"
              className="group glass-button inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold"
            >
              currently learning
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/til"
              className="group glass-button-secondary inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold"
            >
              <Zap className="h-5 w-5" />
              today i learned
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
