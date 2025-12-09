
import { ArrowRight, Github, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden sage-gradient py-24 md:py-32">
      <div className="container px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full minimal-card px-4 py-2 text-sm shadow-lg">
            <FileText className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Synced from Obsidian</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            My Digital
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {" "}Garden
            </span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
            A collection of thoughts, learnings, and insights. Automatically synced from my Obsidian vault, 
            where ideas grow and knowledge blooms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/blog"
              className="glass-button inline-flex items-center justify-center rounded-2xl px-8 py-4 text-sm font-semibold text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Explore Blog Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              to="/til"
              className="minimal-card inline-flex items-center justify-center rounded-2xl px-8 py-4 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Today I Learned
            </Link>
          </div>
          
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Github className="h-4 w-4" />
              <span>Automatically synced from Git repository</span>
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
