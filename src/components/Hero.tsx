
import { ArrowRight, Github, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background py-24 md:py-32">
      <div className="container px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm">
            <FileText className="mr-2 h-4 w-4" />
            Synced from Obsidian
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
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Explore Blog Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link 
              to="/til"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
      
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
    </section>
  );
};

export default Hero;
