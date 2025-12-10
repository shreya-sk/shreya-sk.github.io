
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Lightbulb, Home, Code, Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'home', icon: Home },
    { path: '/blog', label: 'posts', icon: BookOpen },
    { path: '/til', label: 'journal', icon: Lightbulb },
    { path: '/gists', label: 'gists', icon: Code },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 font-semibold text-base">
          <BookOpen className="h-5 w-5" />
          <span>shreya's garden</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                isActive(path)
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 glass-mobile-menu animate-fade-in">
          <nav className="container px-4 py-4 flex flex-col space-y-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive(path)
                    ? 'bg-white/20 text-foreground font-medium'
                    : 'text-foreground/70 hover:text-foreground hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
