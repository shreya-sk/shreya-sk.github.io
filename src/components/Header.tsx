
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Lightbulb, Home } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
          <BookOpen className="h-6 w-6" />
          <span>My Digital Garden</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              isActive('/') 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/blog" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              isActive('/blog') 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Blog</span>
          </Link>
          
          <Link 
            to="/til" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              isActive('/til') 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>Today I Learned</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
