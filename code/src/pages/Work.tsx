import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Download, Mail, Linkedin, Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

interface CaseStudy {
  n: string;
  title: string;
  context: string;
  problem: string;
  whatIDid: string;
  stack: string[];
  outcome: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    n: "01",
    title: "Onboarding 50+ application pipelines onto the shared delivery framework",
    context:
      "Sonic's DevOps team runs a central CI/CD framework - Ansible-driven, deploying through Azure DevOps and Octopus onto on-prem Kubernetes - so digital product teams don't each invent their own delivery path.",
    problem:
      "Dozens of application pipelines still sat outside it: inconsistent stages, hand-maintained configs, no common quality or security gates, and every platform change meant touching each pipeline by hand.",
    whatIDid:
      "Onboarded 50+ pipelines. For each: mapped the existing build and release, expressed it in the framework's Ansible roles and Octopus steps, added the standard gates, and cut over with the owning team. Wrote the onboarding runbook the team now uses.",
    stack: ["Ansible", "Azure DevOps / TFS", "Octopus Deploy", "Kubernetes", "Docker", "Helm", "ArgoCD", "Harbor"],
    outcome:
      "50+ pipelines standardised across ~10 product teams and five environments (dev, UAT, QC, ET, prod) in Sydney and Brisbane. Framework changes now roll out once, not per pipeline.",
  },
  {
    n: "02",
    title: "Extending the Go tool that generates pipeline configuration",
    context:
      "The team has a Go CLI, originally designed by a colleague, that renders Ansible inventories, Azure DevOps YAML and Kubernetes manifests from a small per-application spec - so configuration is generated, not hand-copied.",
    problem:
      "New deployment shapes kept arriving that the tool couldn't express - stateful workloads, and Angular front-ends whose Node build image has to match their Angular version. Each gap sent teams back to manual edits.",
    whatIDid:
      "Co-maintain the tool. Added StatefulSet deployment support (persistent volumes, ordered rollout) and dynamic Node image selection keyed off the app's Angular version, plus ongoing upgrades and fixes. Helped move it from one person's tool to something the team owns.",
    stack: ["Go", "Go templates", "YAML", "Ansible", "Azure DevOps", "Kubernetes"],
    outcome:
      "Pipeline setup time cut ~70%. New deployment shapes are a template change and a re-render, not a fresh round of hand edits across the estate.",
  },
  {
    n: "03",
    title: "Self-managed LLM observability for Sonic Clinical Trials (Langfuse)",
    context:
      "Sonic Clinical Trials needed observability for an AI workflow. Langfuse's open-source edition covered the use case, deployed self-managed into our Kubernetes.",
    problem:
      "Langfuse isn't one app - it needs Postgres, ClickHouse, Redis/Valkey and S3-compatible blob storage. The chart's bundled quick-install for all four uses Bitnami images, and after Bitnami's August 2025 registry restructure the chart pulls from a path that doesn't exist in our Harbor registry at all. The quick-start was a dead end before it started.",
    whatIDid:
      "Skipped the bundled backing services. Provisioned Postgres and Valkey through the CRD-based operators we already run for other products. Evaluated and deployed the ClickHouse Kubernetes Operator cluster-wide. Wired up S3-compatible storage, gave Langfuse its own hostname (a shared-domain path prefix breaks other observability UIs we run), and converted the vendor's Helm values into a template the Ansible pipeline renders and deploys.",
    stack: ["Langfuse", "Kubernetes", "Helm", "Ansible", "PostgreSQL operator", "Valkey operator", "ClickHouse Operator", "S3-compatible storage", "HashiCorp Vault"],
    outcome:
      "Langfuse running self-managed on infrastructure patterns we already operate, not deprecated bundled images. The ClickHouse Operator is now available cluster-wide for future projects.",
  },
  {
    n: "04",
    title: "Moving every product from VMware Tanzu to VKS",
    context:
      "Sonic's infrastructure team stood up vSphere Kubernetes Service (VKS) clusters to replace the Tanzu (TKG) estate. The DevOps team's job was to get every product across without breaking the framework that deploys it.",
    problem:
      "35 products, each with its own config, secrets, storage and ingress - and none could simply be copied. Every one had to be re-targeted, redeployed through the framework, verified with its product team, and cut over.",
    whatIDid:
      "Migrated products end-to-end: updated each application's Ansible inventory, Helm values and ArgoCD target for VKS, deployed through the standard pipeline, validated with the owning team, cut over. The StatefulSet support in the Go tool (02) came out of this work, so stateful products could be generated rather than hand-migrated.",
    stack: ["Kubernetes (Tanzu → VKS)", "Helm", "ArgoCD", "Ansible", "Azure DevOps", "Octopus Deploy", "Harbor"],
    outcome:
      "All 35 products now deploy to VKS across the full estate through the same framework, with the infrastructure and DevOps teams' responsibilities cleanly split: they built the clusters, we moved the applications.",
  },
  {
    n: "05",
    title: "Bringing legacy Angular/IIS and .NET apps into automated delivery without rewrites",
    context:
      "A set of older Angular/IIS and .NET applications sat outside the framework because it assumed containerised, Kubernetes-native workloads.",
    problem:
      "Rewriting them wasn't on anyone's roadmap, but leaving them out meant manual deployments and none of the shared gates.",
    whatIDid:
      "Built a Docker-based artefact-extraction path so legacy builds produce framework-compatible artefacts, enabling automated Octopus deployments to their existing IIS targets - no platform rewrite required.",
    stack: ["Docker", "Octopus Deploy", "IIS", "Azure DevOps", "Ansible"],
    outcome:
      "Legacy applications now deploy through the same automated path as modern services, with the same gates.",
  },
  {
    n: "06",
    title: "Security and code-quality scanning as a pipeline default",
    context:
      "SonarQube and Snyk existed, but coverage was uneven: modern services mostly had it, legacy .NET had none, and project configuration lived in people's heads.",
    problem:
      "Findings weren't consistently surfaced before deployment - a compliance gap in a regulated healthcare environment working to ISO 27001 / NIST-aligned controls. Legacy .NET couldn't even be scanned: the shared agents didn't have the toolchain.",
    whatIDid:
      "Made SonarQube and Snyk standard stages across the microservices estate. Stood up a dedicated build VM with the full legacy .NET toolchain so older projects could be built and scanned by the shared agents, and enabled Sonar for them across five product teams. Took ownership of SonarQube project configuration and moved pipeline secrets into HashiCorp Vault.",
    stack: ["SonarQube", "Snyk", "HashiCorp Vault", "Azure DevOps", ".NET", "Windows build agents", "Ansible"],
    outcome:
      "Scanning is part of the pipeline definition, not a per-team decision. Legacy .NET coverage spans five product teams and is still growing. Secrets no longer live in pipeline variables.",
  },
  {
    n: "07",
    title: "Shared framework components and test infrastructure",
    context:
      "Product teams kept re-solving the same small problems inside their own pipelines, and building their own API and E2E test setups.",
    problem:
      "Duplicate logic, inconsistent behaviour, no single place to fix a bug - and every team paying the setup cost for testing separately.",
    whatIDid:
      "Wrote custom Python logic packaged as an Ansible filter plugin so behaviour is defined once in the framework. Deployed Bruno and Playwright as shared test infrastructure, giving teams a self-serve path for API contract tests and end-to-end automation.",
    stack: ["Python", "Ansible", "Bruno", "Playwright", "Azure DevOps"],
    outcome:
      "One fix propagates everywhere. Teams get API and E2E testing off the shelf instead of building their own.",
  },
  {
    n: "08",
    title: "Incident response and support-team dashboards",
    context:
      "The DevOps team carries L2 incident response for the CI/CD estate in ServiceNow.",
    problem:
      "SLA compliance and backlog were tracked by hand, and the support team had no forward view of load.",
    whatIDid:
      "Triage incoming tickets, route them to the right product team, and write knowledge-base articles so other teams resolve common issues themselves (ITIL v5). Built SLA-compliance and backlog-prediction dashboards in Grafana over ServiceNow data.",
    stack: ["ServiceNow", "Grafana", "SQL", "Python"],
    outcome:
      "100+ incidents handled. SLA breach rate down from 38% to 4% after the knowledge-base and dashboard work; the support team now has a live SLA view and a predicted backlog.",
  },
];



interface Cert {
  name: string;
  issuer: string;
  date: string;
  verify?: { label: string; href: string };
  scheduled?: boolean;
}

const CERTS: Cert[] = [
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "CNCF / The Linux Foundation",
    date: "Completed 9 Jun 2026",
    verify: { label: "Verify · ID LF-t9t8suj4ra", href: "https://training.linuxfoundation.org/certification/verify" },
  },
  {
    name: "ITIL Foundation, Version 5",
    issuer: "PeopleCert",
    date: "Effective 9 Jun 2026 · renews Jun 2029",
  },
  {
    name: "AWS Certified Solutions Architect - Associate",
    issuer: "AWS",
    date: "Scheduled Oct 2026",
    scheduled: true,
  },
];

const EDUCATION = [
  {
    degree: "Bachelor of Advanced Computing (Honours), First Class",
    school: "University of Sydney, 2024",
    detail:
      "Major: Computational Data Science · Minor: Cognitive Psychology. Honours thesis: MASCoT - multi-aspect sentiment analysis using BERT and contrastive learning (87% accuracy, Honours Class I).",
  },
  {
    degree: "IB Diploma",
    school: "Neerja Modi School, 2020",
  },
];

const STATS: Array<{ value: string; label: string }> = [
  { value: "50+", label: "pipelines onboarded" },
  { value: "35", label: "products moved Tanzu → VKS" },
  { value: "~70%", label: "faster pipeline setup" },
  { value: "38% → 4%", label: "SLA breach rate" },
  { value: "100+", label: "incidents handled" },
];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 py-2.5">
    <div className="font-mono text-[11px] uppercase tracking-widest text-accent shrink-0">
      {label}
    </div>
    <div className="text-[15px] leading-relaxed text-foreground/85">{children}</div>
  </div>
);

const StackChips = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((s) => (
      <span
        key={s}
        className="font-mono text-[11px] px-2 py-0.5 border border-foreground/20 text-foreground/80"
      >
        {s}
      </span>
    ))}
  </div>
);

// Flow diagram: commit -> Azure DevOps -> Go build tool -> Harbor -> Ansible
// -> Octopus -> VKS, with build-time scanning hanging off Azure DevOps and
// deploy-time secrets hanging off Ansible. Plain SVG, no colour beyond the
// site's accent.
const PipelineDiagram = () => (
  <div className="overflow-x-auto mb-10 -mx-1 px-1">
    <svg viewBox="0 0 1020 225" className="min-w-[860px] w-full" style={{ maxWidth: 1020 }}>
      <defs>
        <marker id="wf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>

      {/* main flow connectors */}
      <g className="text-foreground/40" stroke="currentColor" strokeWidth="1.5">
        <line x1="90" y1="45" x2="116" y2="45" markerEnd="url(#wf-arrow)" />
        <line x1="248" y1="45" x2="274" y2="45" markerEnd="url(#wf-arrow)" />
        <line x1="456" y1="45" x2="482" y2="45" markerEnd="url(#wf-arrow)" />
        <line x1="604" y1="45" x2="630" y2="45" markerEnd="url(#wf-arrow)" />
        <line x1="732" y1="45" x2="758" y2="45" markerEnd="url(#wf-arrow)" />
        <line x1="890" y1="45" x2="916" y2="45" markerEnd="url(#wf-arrow)" />
      </g>

      {/* main nodes */}
      <g className="text-foreground" stroke="currentColor" strokeWidth="1.5" fill="none">
        <rect x="0" y="20" width="90" height="50" />
        <rect x="118" y="20" width="130" height="50" />
        <rect x="276" y="20" width="180" height="50" />
        <rect x="484" y="20" width="120" height="50" />
        <rect x="632" y="20" width="100" height="50" />
        <rect x="760" y="20" width="130" height="50" />
        <rect x="918" y="20" width="90" height="50" />
      </g>
      <g className="text-foreground" fontFamily="'JetBrains Mono', monospace" fontSize="12" textAnchor="middle" fill="currentColor">
        <text x="45" y="49">commit</text>
        <text x="183" y="49">Azure DevOps</text>
        <text x="366" y="42">Go build tool</text>
        <text x="366" y="56" fontSize="9">(scaffold + validate)</text>
        <text x="544" y="42">Harbor</text>
        <text x="544" y="57" fontSize="11">(registry)</text>
        <text x="682" y="49">Ansible</text>
        <text x="825" y="42">Octopus</text>
        <text x="825" y="56" fontSize="9">(or build.yaml)</text>
        <text x="963" y="49">VKS</text>
      </g>

      {/* branch: build-time quality & security gates hang off Azure DevOps */}
      <g className="text-accent" stroke="currentColor" strokeWidth="1.5" fill="none">
        <path d="M183,70 V100 H90 V148" markerEnd="url(#wf-arrow)" />
        <path d="M183,100 V148" markerEnd="url(#wf-arrow)" />
        <path d="M183,100 H276 V148" markerEnd="url(#wf-arrow)" />
      </g>
      {/* branch: deploy-time secrets hang off Ansible */}
      <g className="text-accent" stroke="currentColor" strokeWidth="1.5" fill="none">
        <path d="M682,70 V148" markerEnd="url(#wf-arrow)" />
      </g>

      <g className="text-foreground" stroke="currentColor" strokeWidth="1.5" fill="none">
        <rect x="45" y="150" width="90" height="40" />
        <rect x="138" y="150" width="90" height="40" />
        <rect x="231" y="150" width="90" height="40" />
        <rect x="637" y="150" width="90" height="40" />
      </g>
      <g className="text-foreground" fontFamily="'JetBrains Mono', monospace" fontSize="11" textAnchor="middle" fill="currentColor">
        <text x="90" y="174">SonarQube</text>
        <text x="183" y="174">Trivy</text>
        <text x="276" y="174">Snyk</text>
        <text x="682" y="174">Vault</text>
      </g>
      <g className="text-muted-foreground" fontFamily="'JetBrains Mono', monospace" fontSize="9" textAnchor="middle" fill="currentColor">
        <text x="183" y="207">BUILD-TIME QUALITY &amp; SECURITY GATES</text>
        <text x="682" y="207">DEPLOY-TIME SECRETS</text>
      </g>
    </svg>
  </div>
);

const CaseStudyGridCard = ({ cs, onOpen }: { cs: CaseStudy; onOpen: () => void }) => (
  <button
    type="button"
    onClick={onOpen}
    className="group flex flex-col text-left border border-foreground/20 hover:border-accent transition-colors px-4 py-4 min-h-[200px]"
  >
    <span className="font-mono text-[11px] text-accent mb-2">{cs.n}</span>
    <h3 className="font-bold text-sm leading-snug tracking-tight mb-2">{cs.title}</h3>
    <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-3 flex-1">
      {cs.outcome}
    </p>
    <div className="flex items-center justify-between mt-3 pt-1">
      <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
        {cs.stack.length} technologies
      </span>
      <span className="inline-flex items-center gap-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
        Expand
        <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </div>
  </button>
);

const CaseStudyModal = ({ cs, onClose }: { cs: CaseStudy | null; onClose: () => void }) => (
  <Dialog open={!!cs} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl">
      {cs && (
        <>
          <DialogHeader>
            <div className="font-mono text-xs text-accent mb-1">{cs.n}</div>
            <DialogTitle className="text-left font-bold text-xl md:text-2xl tracking-tight leading-snug">
              {cs.title}
            </DialogTitle>
          </DialogHeader>

          <div className="bg-accent/10 border-l-2 border-accent px-4 py-3">
            <p className="text-[15px] leading-relaxed font-medium text-foreground/90">{cs.outcome}</p>
          </div>

          <StackChips items={cs.stack} />

          <div className="divide-y divide-foreground/10">
            <Field label="Context">{cs.context}</Field>
            <Field label="Problem">{cs.problem}</Field>
            <Field label="What I did">{cs.whatIDid}</Field>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);

const Work = () => {
  usePageMeta(
    "work",
    "DevOps engineer in Sydney. I standardise how a large healthcare enterprise builds, scans and ships software - CI/CD, Kubernetes, IaC, pipeline security."
  );
  const [openCase, setOpenCase] = useState<CaseStudy | null>(null);

  return (
    <div className="min-h-screen sage-gradient">
      {/* HERO / IDENTITY - lifted from the old /resume page, bio merged in */}
      <section className="border-b-2 border-foreground/90">
        <div className="container px-6 pt-16 pb-16 max-w-5xl mx-auto">
          <div className="font-mono text-[13px] uppercase tracking-wide text-accent mb-4">
            Shreya · Work
          </div>
          <h1 className="font-bold uppercase tracking-tighter leading-[1.05] text-4xl md:text-6xl mb-3">
            Automation, DevOps
            <br />& Infrastructure
          </h1>
          <div className="font-mono text-[15px] uppercase tracking-wide text-muted-foreground mb-5">
            Sonic Healthcare · Aug 2022 – Current
          </div>
          <p className="text-lg leading-relaxed max-w-[68ch] text-foreground/80 mb-8">
            I'm a DevOps engineer at Sonic Healthcare - a global pathology, radiology and
            primary-care group. Since 2022 I've been on the team that runs the shared CI/CD
            framework Sonic's digital product teams deploy through. Half the job is platform
            work: onboarding pipelines, extending the Go and Ansible tooling, moving every
            product from Tanzu to VKS, putting security scanning where it wasn't. The other half
            is being the person product teams come to - a new package to deploy, a Postgres to
            stand up, a scan to add, a release that's stuck. Before the title change I was a
            software engineer on the same team.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
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
          <p className="font-mono text-xs text-muted-foreground max-w-[68ch]">
            Everything under Enterprise work is proprietary to Sonic Healthcare - described, not
            shown. Code I can share is under Open source &amp; side projects.
          </p>
        </div>
      </section>

      {/* Numbers strip - the first visual break, right after the hero */}
      <section className="border-b-2 border-foreground/90">
        <div className="container px-6 py-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-extrabold text-xl md:text-2xl tracking-tight text-foreground">
                  {s.value}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container px-6 pt-12 pb-16 md:pb-20">
        <div className="mx-auto max-w-[720px]">
          {/* Jump-to row */}
          <nav className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground mb-10">
            <a href="#enterprise-work" className="hover:text-accent transition-colors">Enterprise work</a>
            <span aria-hidden="true">·</span>
            <a href="#open-source" className="hover:text-accent transition-colors">Open source</a>
            <span aria-hidden="true">·</span>
            <a href="#certifications" className="hover:text-accent transition-colors">Certs</a>
            <span aria-hidden="true">·</span>
            <a href="#education" className="hover:text-accent transition-colors">Education</a>
            <span aria-hidden="true">·</span>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>
        </div>

        {/* Enterprise work - wider column than the reading sections below, so the
            case-study grid has room to breathe */}
        <div className="mx-auto max-w-5xl">
          <div id="enterprise-work" className="mb-8 scroll-mt-24">
            <h2 className="font-bold uppercase tracking-tighter text-xl md:text-2xl">
              Enterprise work
            </h2>
            <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground mt-1">
              Sonic Healthcare · 2022 → present
            </div>
          </div>

          <PipelineDiagram />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {CASE_STUDIES.map((cs) => (
              <CaseStudyGridCard key={cs.n} cs={cs} onOpen={() => setOpenCase(cs)} />
            ))}
          </div>

          <CaseStudyModal cs={openCase} onClose={() => setOpenCase(null)} />
        </div>

        <div className="mx-auto max-w-[720px]">
          {/* Open source & side projects */}
          <div id="open-source" className="mb-8 mt-16 scroll-mt-24">
            <h2 className="font-bold uppercase tracking-tighter text-xl md:text-2xl">
              Open source &amp; side projects
            </h2>
          </div>

          <div className="space-y-10 mb-20">
            <div className="border-t border-foreground/20 pt-6">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="font-bold text-lg tracking-tight">
                  <a
                    href="/editor"
                    className="hover:text-accent transition-colors inline-flex items-center gap-1.5"
                  >
                    Vault editor
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </h3>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
                /editor · VAULT_EDITOR.md in the repo
              </p>
              <p className="text-[15px] leading-relaxed text-foreground/85 mb-2">
                A browser-based editor for an Obsidian vault that does real git plumbing (blob →
                tree → commit → fast-forward ref) directly against GitHub's Git Data API, avoiding
                a CORS proxy. PAT encrypted into <code className="text-accent">vault.lock.json</code> behind
                a password; conflict handling with browser-wins + warning callout; code-split so the
                blog bundle stays small.
              </p>
              <p className="text-[15px] leading-relaxed text-foreground/70 italic mb-2">
                The kind of tooling I build for myself: understand the protocol, skip the dependency.
              </p>
              <StackChips items={["React", "TypeScript", "GitHub Git Data API"]} />
            </div>

            <div className="border-t border-foreground/20 pt-6">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="font-bold text-lg tracking-tight">eks-platform</h3>
                <span className="font-mono text-[11px] uppercase tracking-wide text-accent shrink-0">
                  in progress
                </span>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
                GitHub repo linked here once published (Sep–Oct 2026)
              </p>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Production-shaped AWS platform: Terraform (VPC/EKS/IAM), ArgoCD app-of-apps,
                kube-prometheus-stack with SLOs, Kyverno policies mapped to ISO 27001 controls,
                boto3 drift and cost scripts.
              </p>
            </div>
          </div>

          {/* Certifications */}
          <div id="certifications" className="mb-8 scroll-mt-24">
            <h2 className="font-bold uppercase tracking-tighter text-xl md:text-2xl">
              Certifications
            </h2>
          </div>
          <div className="space-y-5 mb-14">
            {CERTS.map((c) => (
              <div key={c.name} className="border-t border-foreground/20 pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-[15px]">{c.name}</span>
                  {c.scheduled && (
                    <span className="font-mono text-[11px] uppercase tracking-wide text-accent shrink-0">
                      scheduled
                    </span>
                  )}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground mt-1">
                  {c.issuer} · {c.date}
                </div>
                {c.verify && (
                  <a
                    href={c.verify.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline mt-1"
                  >
                    {c.verify.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Education */}
          <div id="education" className="mb-8 scroll-mt-24">
            <h2 className="font-bold uppercase tracking-tighter text-xl md:text-2xl">
              Education
            </h2>
          </div>
          <div className="space-y-5 mb-20">
            {EDUCATION.map((e) => (
              <div key={e.degree} className="border-t border-foreground/20 pt-4">
                <div className="font-semibold text-[15px]">{e.degree}</div>
                <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground mt-1">
                  {e.school}
                </div>
                {e.detail && (
                  <p className="text-[15px] leading-relaxed text-foreground/85 mt-2">{e.detail}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div id="contact" className="border-t border-foreground/20 pt-10 text-center scroll-mt-24">
            <p className="font-mono text-sm uppercase tracking-wide text-muted-foreground mb-5">
              Want to talk about any of this?
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:shreyakothari1901@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 font-bold text-[13px] uppercase bg-accent text-accent-foreground border border-accent hover:bg-accent/85 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
              <a
                href="https://www.linkedin.com/in/shreyak19"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 font-bold text-[13px] uppercase border border-foreground/20 hover:border-accent hover:text-accent transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
              <a
                href="https://github.com/shreya-sk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 font-bold text-[13px] uppercase border border-foreground/20 hover:border-accent hover:text-accent transition-colors"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
