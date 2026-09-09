import { usePageMeta } from "@/hooks/usePageMeta";
import { Download, Mail, Linkedin, Github, ExternalLink } from "lucide-react";

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
  stack: string;
  outcome: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    n: "01",
    title: "Onboarding 50+ application pipelines onto a shared Ansible/Kubernetes deployment framework",
    context:
      "Sonic runs a central CI/CD framework - Ansible-driven, deploying to on-prem Kubernetes (VMware Tanzu) via Azure DevOps and Octopus Deploy - so product teams don't each invent their own delivery path.",
    problem:
      "Dozens of application pipelines were still bespoke: inconsistent stages, hand-maintained configs, no common security gates, and every upgrade to the platform meant touching each one by hand.",
    whatIDid:
      "Migrated and onboarded 50+ pipelines onto the framework. For each: mapped the existing build/release, translated it into the framework's Ansible roles and Octopus steps, added the standard quality and security stages, and cut over with the owning team. Wrote the onboarding runbook other engineers now use.",
    stack: "Ansible · Azure DevOps / TFS · Octopus Deploy · Kubernetes (Tanzu) · Docker · Helm · ArgoCD · Harbor",
    outcome:
      "50+ pipelines standardised across ~10 product teams and five environments - dev, UAT, QC, ET and prod - spanning our Brisbane and Sydney sites. Framework-level changes now roll out once instead of per pipeline.",
  },
  {
    n: "02",
    title: "Go templating tool that generates pipeline configuration",
    context:
      "Every onboarding produced near-identical Ansible inventories, Azure DevOps YAML and Tanzu manifests, hand-edited from copies of the last one.",
    problem:
      "Copy-paste configs drifted, took hours per pipeline, and made platform upgrades a find-and-replace exercise across the estate.",
    whatIDid:
      "Co-maintain the team's Go CLI that renders Ansible, Azure DevOps and Kubernetes configuration from versioned templates. Added StatefulSet deployment support and dynamic Node image selection by Angular version, and handle ongoing upgrades and fixes to the tool.",
    stack: "Go · Go templates · YAML · Ansible · Azure DevOps · Kubernetes (Tanzu)",
    outcome:
      "Pipeline setup time cut ~70%. Upgrades and new features become a template change plus a re-render, rather than a fresh round of manual edits across every pipeline.",
  },
  {
    n: "03",
    title: "Self-managed LLM observability platform (Langfuse)",
    context:
      "SCT (Sonic Clinical Trials) needed observability for an AI workflow - Langfuse, deployed self-managed into Kubernetes. The open-source edition covers our use case, so no enterprise license was needed.",
    problem:
      "Langfuse isn't one app - it needs four backing services (Postgres, ClickHouse, Redis/Valkey, S3-compatible blob storage), and the chart's bundled \"quick install\" path for all four uses Bitnami images. Bitnami restructured their registry in August 2025 and the chart now pulls from a \"bitnamilegacy\" path that doesn't exist in our Harbor registry at all - and even the older \"bitnami\" path is missing ClickHouse and Minio entirely. The quick-start option was a dead end before it started.",
    whatIDid:
      "Skipped the chart's bundled backing services entirely. Provisioned Postgres and Valkey the way we already do everywhere else - CRD-based operators, the same pattern SIMS runs on - so that part had no real blocker. For ClickHouse, evaluated and deployed an instance through the ClickHouse Kubernetes Operator (a cluster-wide install, so it's now available to future projects too). Wired up S3-compatible blob storage against credentials the business team provided, gave Langfuse its own dedicated web address (a shared-domain path prefix breaks other observability UIs we run, so this avoided that outright), and converted the vendor's Helm values into a template our Ansible pipeline renders and deploys.",
    stack: "Langfuse · Kubernetes · Helm · Ansible · PostgreSQL (operator) · Valkey (operator) · ClickHouse Kubernetes Operator · S3-compatible storage · HashiCorp Vault",
    outcome:
      "Langfuse running self-managed in its own namespace, all four backing services on infrastructure patterns we already operate and trust rather than deprecated bundled images. The ClickHouse Operator install is now available cluster-wide for any future project that needs it.",
  },
  {
    n: "04",
    title: "Moving every product from VMware Tanzu to VKS",
    context:
      "Sonic's infrastructure team stood up new vSphere Kubernetes Service (VKS) clusters to replace the Tanzu (TKG) estate. The DevOps team's job was to get every product from the old clusters to the new ones without breaking the shared CI/CD framework that deploys them.",
    problem:
      "35 products across dev, UAT, QC, ET and prod, in Sydney and Brisbane, each with their own configs, secrets, storage and ingress - and none of them could just be copied over. Every one had to be re-deployed through the framework against the new target, verified, and cut over with the owning team.",
    whatIDid:
      "Migrated products end-to-end: updated each application's framework config (Ansible inventories, Helm values, Azure DevOps and ArgoCD targets) for VKS, deployed through the standard pipeline, validated the deployment with the product team, and cut over. Extended the Go templating tool with StatefulSet support during this work so stateful products could be generated rather than hand-migrated.",
    stack: "Kubernetes (Tanzu → VKS) · Helm · ArgoCD · Ansible · Azure DevOps · Octopus Deploy · Harbor",
    outcome:
      "All 35 products now deploy to VKS across five environments and two sites via the same framework.",
  },
  {
    n: "05",
    title: "Bringing legacy .NET applications into Kubernetes-based delivery without rewrites",
    context:
      "A set of older Angular/IIS and .NET applications sat outside the framework because it assumed containerised, Kubernetes-native workloads.",
    problem:
      "Rewriting them wasn't on anyone's roadmap, but leaving them out meant manual deployments and no shared security gates.",
    whatIDid:
      "Built a Docker-based artefact-extraction path so legacy builds produce framework-compatible artefacts, enabling automated Octopus deployments to their existing IIS targets - no platform rewrite required. Separately, stood up a dedicated build VM with the exact toolchain these projects needed so they could be scanned and built by the shared agents.",
    stack: "Docker · Octopus Deploy · IIS · Windows build agents · Azure DevOps",
    outcome:
      "The legacy applications now deploy through the same automated path as modern services, with the same gates.",
  },
  {
    n: "06",
    title: "Security scanning across the microservices estate and legacy .NET",
    context:
      "SonarQube and Snyk existed, but coverage was uneven: modern services mostly had it, legacy .NET projects had none, and project configuration lived in people's heads.",
    problem:
      "Security and code-quality findings weren't consistently surfaced before deployment - a compliance gap in a regulated healthcare environment (ISO 27001 / NIST-aligned controls).",
    whatIDid:
      "Integrated SonarQube and Snyk as standard stages across the microservices estate. Extended SonarQube scanning to legacy .NET projects - including the build-VM work above so the scanner had a compliant toolchain - and enabled it across 5 Sonic product teams, with coverage of the legacy .NET estate continuing to expand. Took ownership of SonarQube project configuration and moved pipeline secrets into HashiCorp Vault.",
    stack: "SonarQube · Snyk · HashiCorp Vault · Azure DevOps · .NET · Ansible",
    outcome:
      "Scanning is now part of the pipeline definition, not a per-team decision. Sonar coverage spans 5 product teams' legacy .NET projects so far, with more being onboarded on an ongoing basis. Secrets no longer live in pipeline variables.",
  },
  {
    n: "07",
    title: "Reusable framework components and shared test infrastructure",
    context: "Teams kept re-solving the same small problems inside their pipelines.",
    problem: "Duplicate logic, inconsistent behaviour, and no single place to fix a bug.",
    whatIDid:
      "Wrote framework-level components adopted across projects - including a Node image-detection task and custom Python logic packaged as an Ansible filter plugin - so behaviour is defined once in the framework. Also deployed Bruno and Playwright as shared testing infrastructure, giving teams a consistent, self-serve path for API contract tests and end-to-end automation.",
    stack: "Python · Ansible · Node · Bruno · Playwright · Azure DevOps",
    outcome:
      "Adopted across the pipeline estate; one fix propagates everywhere. Teams now have a shared, self-serve path for API and E2E testing instead of building their own.",
  },
  {
    n: "08",
    title: "Incident response and support-team dashboards",
    context: "The platform team carries incident response for the CI/CD estate in ServiceNow.",
    problem: "SLA compliance and backlog were being tracked manually, and the support team had no forward view of load.",
    whatIDid:
      "Provide L2 incident response (ITIL v5) - triaging incoming tickets, rerouting them to the right product team, and writing knowledge-base articles that let other teams resolve common issues themselves. Built SLA-compliance and backlog-prediction dashboards in Grafana over ServiceNow data, now used by the support team.",
    stack: "ServiceNow · Grafana · SQL · Python",
    outcome:
      "100+ incidents handled to date. SLA breach rate down from 38% to 4% after the knowledge-base and dashboard work; support team now has a live SLA view and a predicted backlog instead of tracking compliance by hand.",
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 py-2.5">
    <div className="font-mono text-[11px] uppercase tracking-widest text-accent shrink-0">
      {label}
    </div>
    <div className="text-[15px] leading-relaxed text-foreground/85">{children}</div>
  </div>
);

const Work = () => {
  usePageMeta(
    "work",
    "DevOps engineer in Sydney. I standardise how a large healthcare enterprise builds, scans and ships software - CI/CD, Kubernetes, IaC, pipeline security."
  );

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
            I'm a DevOps engineer at Sonic Healthcare, one of the world's largest pathology
            groups. Since 2022 I've worked on the shared CI/CD framework product teams deploy
            through - onboarding pipelines, extending the tooling around them, migrating every
            product from Tanzu to VKS, and putting security scanning where it wasn't before.
            Before the title change I was a software engineer on the same team.
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

          {/* Enterprise work */}
          <div id="enterprise-work" className="mb-8 scroll-mt-24">
            <h2 className="font-bold uppercase tracking-tighter text-xl md:text-2xl">
              Enterprise work
            </h2>
            <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground mt-1">
              Sonic Healthcare · 2022 → present
            </div>
          </div>

          <div className="space-y-14 mb-20">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.n} className="border-t border-foreground/20 pt-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-xs text-accent shrink-0">{cs.n}</span>
                  <h3 className="font-bold text-lg md:text-xl tracking-tight leading-snug">
                    {cs.title}
                  </h3>
                </div>
                <div className="divide-y divide-foreground/10">
                  <Field label="Context">{cs.context}</Field>
                  <Field label="Problem">{cs.problem}</Field>
                  <Field label="What I did">{cs.whatIDid}</Field>
                  <Field label="Stack">{cs.stack}</Field>
                  <Field label="Outcome">{cs.outcome}</Field>
                </div>
              </div>
            ))}
          </div>

          {/* Open source & side projects */}
          <div id="open-source" className="mb-8 scroll-mt-24">
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
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                React · TypeScript · GitHub Git Data API
              </p>
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
