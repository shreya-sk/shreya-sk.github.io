import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const NotFound = () => {
  const location = useLocation();
  usePageMeta("404", "This page doesn't exist.");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] sage-gradient flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mb-4 font-mono text-xs uppercase tracking-wide text-accent">
          404 / not found
        </div>
        <h1 className="mb-4 text-5xl md:text-7xl font-extrabold uppercase tracking-tighter leading-[0.95]">
          nothing here<span className="text-accent">;</span>
        </h1>
        <p className="mb-8 font-mono text-sm text-muted-foreground">
          <code className="text-foreground/80">{location.pathname}</code> doesn't exist - or moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="glass-button sage inline-flex items-center justify-center px-5 py-2.5 text-sm font-extrabold uppercase"
          >
            back to home
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-extrabold uppercase border border-foreground/90 text-foreground hover:text-accent hover:border-accent transition-colors"
          >
            browse notes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
