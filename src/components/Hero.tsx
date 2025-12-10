
import { ArrowRight, Github, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden sage-gradient py-12 md:py-16">
      <div className="container px-4 relative z-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img
                  src="/profile.png"
                  alt="Shreya"
                  className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white/50 shadow-2xl"
                />

                {/* Animated Speech Bubble */}
                <div className="absolute -top-2 -right-2 speech-bubble-1">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-lg border border-primary/20">
                    <div className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs shadow-lg bg-gradient-to-r from-secondary/20 to-accent/20 border border-secondary/30">
                <FileText className="mr-1.5 h-3.5 w-3.5 text-secondary" />
                <span className="font-medium text-foreground">synced from obsidian</span>
              </div>

              <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                mostly by
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {" "}shreya;
                </span>
              </h1>

              <p className="mb-4 text-sm md:text-base max-w-xl mx-auto md:mx-0 leading-relaxed text-foreground/70">
                an organised corner of an otherwise overflowing brain!
              </p>
          
              <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center">
                <Link
                  to="/blog"
                  className="glass-button sage inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold"
                >
                  currently learning
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/til"
                  className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gradient-to-r from-secondary/80 to-secondary text-secondary-foreground hover:from-secondary hover:to-secondary shadow-lg"
                >
                  today i learned
                </Link>
              </div>

              
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating bubble decorations */}
      <div className="floating-bubble absolute -top-32 -right-32 h-96 w-96" style={{ animationDelay: '0s' }}></div>
      <div className="floating-bubble absolute -bottom-32 -left-32 h-80 w-80" style={{ animationDelay: '5s' }}></div>
      <div className="floating-bubble absolute top-1/4 left-1/4 h-64 w-64" style={{ animationDelay: '10s' }}></div>
      <div className="floating-bubble absolute bottom-1/3 right-1/3 h-72 w-72" style={{ animationDelay: '15s' }}></div>
    </section>
  );
};

export default Hero;
