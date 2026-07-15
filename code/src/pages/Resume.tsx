import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "react-router-dom";
import { Download, Github, Linkedin, Mail } from "lucide-react";

// Chip-style external link, matching the flat design system
const LinkChip = ({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) => (
  <a
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-2 px-4 py-2.5 font-bold text-[13px] uppercase transition-colors ${
      primary
        ? 'bg-accent text-accent-foreground border border-accent hover:bg-accent/85'
        : 'border border-foreground/20 hover:border-accent hover:text-accent'
    }`}
  >
    {children}
  </a>
);

const SectionHeading = ({ title, index }: { title: string; index: string }) => (
  <div className="flex items-baseline justify-between mb-8">
    <h2 className="font-bold uppercase tracking-tighter text-2xl md:text-3xl">{title}</h2>
    <span className="font-mono text-sm uppercase tracking-wide text-muted-foreground">{index}</span>
  </div>
);

const WORK = [
  {
    org: ['Sonic Healthcare', 'DevOps'],
    title: 'CI/CD & release pipeline ownership',
    body: 'Own CI/CD pipelines and release management across the SIT environment using Ansible and Octopus Deploy - reducing manual release steps and giving the team a repeatable path from commit to environment.',
  },
  {
    org: ['Personal', 'Project'],
    title: 'Git-backed Obsidian vault editor',
    body: "A password-locked, in-browser editor that clones this site's Obsidian vault straight from GitHub - CodeMirror editing, a client-side git sync engine with pull/push and conflict detection, and encrypted unlock, all running without a backend.",
    link: { to: '/editor', label: '/editor' },
  },
  {
    org: ['Stemlook', 'Ops'],
    title: 'Airtable-based operations system',
    body: 'Designed and manage the operations backbone for a multi-site education business - enrolment, scheduling, and parent communications in one system.',
  },
];

const SKILLS: Array<{ label: string; items: string }> = [
  { label: 'Infra & orchestration', items: 'Kubernetes, Docker, Kong, Ansible, Linux' },
  { label: 'CI/CD & delivery', items: 'Azure DevOps, Octopus Deploy, GitHub Actions, release management' },
  { label: 'Support & ITSM', items: 'ServiceNow ticketing, incident & request management' },
  { label: 'Security', items: 'Snyk, SonarQube, BeagleSecurity' },
  { label: 'Languages', items: 'Go, Python, Caché ObjectScript' },
];

const CERTS = [
  { name: 'Certified Kubernetes Administrator (CKA)', score: '88%' },
  { name: 'ITIL v5 Foundation', score: '95%' },
];

const Resume = () => {
  usePageMeta('resume', 'Shreya - Automation, DevOps & Infrastructure. CKA certified. Sonic Healthcare.');
  return (
    <div className="min-h-screen sage-gradient">
      {/* HERO / IDENTITY */}
      <section className="border-b-2 border-foreground/90">
        <div className="container px-6 py-16 max-w-5xl mx-auto">
          <div className="font-mono text-[13px] uppercase tracking-wide text-accent mb-4">
            Shreya · Resume
          </div>
          <h1 className="font-bold uppercase tracking-tighter leading-[1.05] text-4xl md:text-6xl mb-3">
            Automation, DevOps
            <br />& Infrastructure
          </h1>
          <div className="font-mono text-[15px] uppercase tracking-wide text-muted-foreground mb-5">
            Sonic Healthcare · Aug 2022 – Current
          </div>
          <p className="text-lg leading-relaxed max-w-xl text-foreground/80 mb-8">
            Building CI/CD pipelines, Kubernetes infrastructure, and automation. CKA and ITIL v5
            certified.
          </p>
          <div className="flex flex-wrap gap-3">
            {/* Drop your PDF at public/resume.pdf and this link works */}
            <LinkChip href="/resume.pdf" primary>
              <Download className="h-3.5 w-3.5" /> Resume PDF
            </LinkChip>
            <LinkChip href="https://www.linkedin.com/in/shreyak19">
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </LinkChip>
            <LinkChip href="https://github.com/shreya-sk">
              <Github className="h-3.5 w-3.5" /> GitHub
            </LinkChip>
            <LinkChip href="mailto:shreyakothari1901@gmail.com">
              <Mail className="h-3.5 w-3.5" /> Email
            </LinkChip>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="border-b-2 border-foreground/90">
        <div className="container px-6 py-14 max-w-5xl mx-auto">
          <SectionHeading title="Selected work" index="02 / Impact" />
          <div className="border-t border-foreground/20">
            {WORK.map((w) => (
              <div
                key={w.title}
                className="group grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 py-8 border-b border-foreground/20 last:border-b-0"
              >
                <div className="font-mono text-[13px] uppercase tracking-wide text-muted-foreground">
                  {w.org[0]}
                  <br />
                  {w.org[1]}
                </div>
                <div>
                  <div className="font-bold text-xl tracking-tight mb-2.5 group-hover:text-accent transition-colors">
                    {w.title}
                  </div>
                  <p className="text-[15px] leading-relaxed text-foreground/80 max-w-2xl">
                    {w.body}{' '}
                    {w.link && (
                      <>
                        Live at{' '}
                        <Link to={w.link.to} className="text-accent underline underline-offset-2">
                          {w.link.label}
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="border-b-2 border-foreground/90">
        <div className="container px-6 py-14 max-w-5xl mx-auto">
          <SectionHeading title="Skills & tools" index="03 / 04" />
          <div className="grid md:grid-cols-3 border-t border-l border-foreground/20">
            {SKILLS.map((s) => (
              <div key={s.label} className="p-6 border-r border-b border-foreground/20">
                <div className="font-mono text-[13px] uppercase tracking-widest text-accent mb-3">
                  {s.label}
                </div>
                <p className="text-[15px] leading-relaxed">{s.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="border-b-2 border-foreground/90">
        <div className="container px-6 py-14 max-w-5xl mx-auto">
          <SectionHeading title="Certifications" index="04" />
          <div className="grid md:grid-cols-2 border-t border-l border-foreground/20">
            {CERTS.map((c) => (
              <div
                key={c.name}
                className="flex items-baseline justify-between gap-4 p-5 border-r border-b border-foreground/20"
              >
                <span className="font-semibold">{c.name}</span>
                <span className="font-mono text-sm font-bold text-accent">{c.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="container px-6 py-12 max-w-5xl mx-auto text-center">
        <p className="font-mono text-[15px] uppercase tracking-wide text-muted-foreground mb-5">
          Want the full picture?
        </p>
        <Link
          to="/blog"
          className="font-bold uppercase text-lg hover:text-accent transition-colors"
        >
          See the notes, TIL log & gists →
        </Link>
      </section>
    </div>
  );
};

export default Resume;
