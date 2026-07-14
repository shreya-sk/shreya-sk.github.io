import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Lightbulb, Home, Code, FileUser, Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", icon: Home, label: "home" },
    { path: "/blog", icon: BookOpen, label: "learning" },
    { path: "/til", icon: Lightbulb, label: "TIL" },
    { path: "/gists", icon: Code, label: "gists" },
    { path: "/resume", icon: FileUser, label: "resume" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b-2 border-foreground/90">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 font-extrabold text-base uppercase tracking-tight">
          <span className="w-2 h-2 bg-accent inline-block" />
          <span>digital diary</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`font-mono text-xs uppercase tracking-wide transition-colors ${
                isActive(path) ? 'text-accent' : 'text-foreground hover:text-accent'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t-2 border-foreground/90">
          <nav className="container px-4 py-3 space-y-1">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-1 py-2.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                  isActive(path) ? 'text-accent' : 'text-foreground hover:text-accent'
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
