import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Lightbulb, Home, Briefcase, Download, Menu, X, Mail, Linkedin, Github } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", icon: Home, label: "home" },
    { path: "/work", icon: Briefcase, label: "work" },
    { path: "/blog", icon: BookOpen, label: "learning" },
    { path: "/til", icon: Lightbulb, label: "TIL" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b-2 border-foreground/90">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 font-extrabold text-base uppercase tracking-tight">
          <span className="w-2 h-2 bg-accent inline-block" />
          <span>shreya k.</span>
        </Link>

        <div className="flex items-center gap-6">
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

          {/* Quick contact - always visible, so reaching me doesn't require scrolling to the footer */}
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-foreground/20">
            <a
              href="mailto:shreyakothari1901@gmail.com"
              aria-label="Email"
              className="text-foreground/70 hover:text-accent transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/shreyak19"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-foreground/70 hover:text-accent transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/shreya-sk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-foreground/70 hover:text-accent transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

          {/* Resume PDF - standalone button, not a page */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs uppercase tracking-wide bg-accent text-accent-foreground hover:bg-accent/85 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Resume
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
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
          <div className="flex items-center gap-5 px-1 pt-2 pb-1 border-t border-foreground/20 mt-1">
            <a href="mailto:shreyakothari1901@gmail.com" aria-label="Email" className="text-foreground/70 hover:text-accent transition-colors">
              <Mail className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/in/shreyak19" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-foreground/70 hover:text-accent transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://github.com/shreya-sk" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-foreground/70 hover:text-accent transition-colors">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
