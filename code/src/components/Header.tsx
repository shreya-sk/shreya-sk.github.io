import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Lightbulb, Home, Code, Menu, X, Sparkles } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/", icon: Home, label: "home" },
    { path: "/blog", icon: BookOpen, label: "learning" },
    { path: "/til", icon: Lightbulb, label: "TIL" },
    { path: "/gists", icon: Code, label: "gists" }
  ];
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled ? 'glass-header py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container flex h-12 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-300">
            digital diary
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-muted/30 backdrop-blur-xl border border-border/30">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive(path)
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {isActive(path) && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary opacity-0 animate-pulse"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative p-2.5 rounded-xl bg-muted/30 backdrop-blur-xl border border-border/30 text-foreground hover:bg-muted/50 transition-all"
          aria-label="Toggle menu"
        >
          <div className="relative w-5 h-5">
            <span className={`absolute left-0 block w-5 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? 'top-2 rotate-45' : 'top-1'
            }`}></span>
            <span className={`absolute left-0 top-2 block w-5 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
            }`}></span>
            <span className={`absolute left-0 block w-5 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? 'top-2 -rotate-45' : 'top-3'
            }`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 transition-all duration-500 ${
        isMenuOpen 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="mx-4 mt-2 p-4 rounded-2xl glass-menu border border-border/30 shadow-2xl">
          <nav className="space-y-1">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
