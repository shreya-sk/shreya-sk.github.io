
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Lightbulb, Home } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 font-semibold text-base">
          <BookOpen className="h-5 w-5" />
          <span>shreya's garden</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
              isActive('/')
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>home</span>
          </Link>

          <Link
            to="/blog"
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
              isActive('/blog')
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>posts</span>
          </Link>

          <Link
            to="/til"
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
              isActive('/til')
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>journal</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
