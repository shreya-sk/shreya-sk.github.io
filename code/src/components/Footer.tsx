import { useLocation } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const location = useLocation();
  // /editor is a full-height app view (its own internal scroll regions) - a
  // footer below it would break the viewport-height layout, so skip it there.
  if (location.pathname === "/editor") return null;

  return (
  <footer className="border-t-2 border-foreground/90 mt-auto">
    <div className="container px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        © {new Date().getFullYear()} Shreya
      </span>
      <div className="flex items-center gap-5">
        <a
          href="mailto:shreyakothari1901@gmail.com"
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground hover:text-accent transition-colors"
        >
          <Mail className="h-3.5 w-3.5" /> email
        </a>
        <a
          href="https://www.linkedin.com/in/shreyak19"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground hover:text-accent transition-colors"
        >
          <Linkedin className="h-3.5 w-3.5" /> linkedin
        </a>
        <a
          href="https://github.com/shreya-sk"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground hover:text-accent transition-colors"
        >
          <Github className="h-3.5 w-3.5" /> github
        </a>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
