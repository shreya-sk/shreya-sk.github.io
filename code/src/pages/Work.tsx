import { usePageMeta } from "@/hooks/usePageMeta";
import { Mail, Linkedin, Github, ExternalLink } from "lucide-react";

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
      "50+ pipelines standardised across the teams that own them. Framework-level changes now roll out once instead of per pipeline.",
  },
  {
    n: "02",
    title: "Go templating tool that generates pipeline configuration",
    context:
      "Every onboarding produced near-identical Ansible inventories, Azure DevOps YAML and Tanzu manifests, hand-edited from copies of the last one.",
    problem:
      "Copy-paste configs drifted, took hours per pipeline, and made platform upgrades a find-and-replace exercise across the estate.",
    whatIDid:
      "Designed and built a CLI in Go that takes a small per-application spec and renders the full set of Ansible, Azure DevOps and Tanzu configuration from versioned templates. Added validation so a bad spec fails at generation time, not at deploy time. Re-rendering from templates is now how upgrades propagate.",
    stack: "Go · Go templates · YAML · Ansible · Azure DevOps · Tanzu",
    outcome:
      "Pipeline setup and management time cut ~50%. Upgrades and new features become a template change plus a re-render, rather than a fresh round of manual edits across every pipeline.",
  },
  {
    n: "03",
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
    n: "04",
    title: "Security scanning across the microservices estate and legacy .NET",
    context:
      "SonarQube and Snyk existed, but coverage was uneven: modern services mostly had it, legacy .NET projects had none, and project configuration lived in people's heads.",
    problem:
      "Security and code-quality findings weren't consistently surfaced before deployment - a compliance gap in a regulated healthcare environment (ISO 27001 / NIST-aligned controls).",
    whatIDid:
      "Integrated SonarQube and Snyk as standard stages across the microservices estate. Extended SonarQube scanning to legacy .NET projects - including the build-VM work above so the scanner had a compliant toolchain - and enabled it across Sonic product teams. Took ownership of SonarQube project configuration and moved pipeline secrets into HashiCorp Vault.",
    stack: "SonarQube · Snyk · HashiCorp Vault · Azure DevOps · .NET · Ansible",
    outcome:
      "Scanning is now part of the pipeline definition, not a per-team decision. Additional projects covered, more product teams onboarded to Sonar, and secrets no longer live in pipeline variables.",
  },
  {
    n: "05",
    title: "Reusable framework components and a Python Ansible filter plugin",
    context: "Teams kept re-solving the same small problems inside their pipelines.",
    problem: "Duplicate logic, inconsistent behaviour, and no single place to fix a bug.",
    whatIDid:
      "Wrote framework-level components adopted across projects - including a Node image-detection task and custom Python logic packaged as an Ansible filter plugin - so behaviour is defined once in the framework.",
    stack: "Python · Ansible · Node · Azure DevOps",
    outcome: "Adopted across the pipeline estate; one fix propagates everywhere.",
  },
  {
    n: "06",
    title: "Incident response and support-team dashboards",
    context: "The platform team carries incident response for the CI/CD estate in ServiceNow.",
    problem: "SLA compliance and backlog were being tracked manually, and the support team had no forward view of load.",
    whatIDid:
      "Provide L2 incident response (ITIL v5). Built SLA-compliance and backlog-prediction dashboards in Grafana over ServiceNow data, now used by the support team.",
    stack: "ServiceNow · Grafana · SQL · Python",
    outcome: "Support team has a live SLA view and a predicted backlog instead of tracking compliance by hand.",
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
  usePageMeta("work", "Case studies from Sonic Healthcare's shared CI/CD framework, plus open-source projects.");

  return (
    <div className="min-h-screen sage-gradient">
      <div className="container px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[720px]">
          {/* Intro */}
          <h1 className="font-bold uppercase tracking-tighter text-4xl md:text-6xl mb-6">
            Work
          </h1>
          <p className="text-lg leading-relaxed text-foreground/85 mb-4">
            I'm a DevOps engineer at Sonic Healthcare, one of the world's largest pathology and
            diagnostics groups. Since 2022 I've worked on the shared CI/CD framework that product
            teams across the enterprise deploy through - onboarding pipelines, writing the tooling
            around them, and putting security scanning where it wasn't before. Before the title
            change I was a software engineer on the same team, so I've been on both sides of the
            pipeline.
          </p>
          <p className="font-mono text-xs text-muted-foreground mb-16">
            Everything under Enterprise work is proprietary to Sonic Healthcare - described here,
            not shown. Code I can share is under Open source &amp; side projects.
          </p>

          {/* Enterprise work */}
          <div className="mb-8">
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
          <div className="mb-8">
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
                Production-shaped AWS platform: Terraform (VPC/EKS/IAM), GitHub Actions with OIDC
                to AWS, ArgoCD app-of-apps, kube-prometheus-stack with SLOs, Kyverno policies mapped
                to ISO 27001 controls, boto3 drift and cost scripts.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="border-t border-foreground/20 pt-10 text-center">
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
