---
type: moc
up: "[[Learning/DevOps/DevOps MOC]]"
tags: [moc, area/devops, topic/docker]
---

← [[HOME|Home]] &nbsp;·&nbsp; [[Learning MOC|Learning]] &nbsp;·&nbsp; [[Learning/DevOps/DevOps MOC|DevOps]]

# Docker

> All Docker and container notes.

---

## 🗺️ Start Here — Reading Order

> [!note] New to Docker? Start here.
> Assumes you know basic Linux commands. Read [[../Containers - Overview|Containers - Overview]] first if you've never used containers.

| Step | Note | Why |
|---|---|---|
| 1 | [[Setup Docker]] | Get Docker running locally before anything else |
| 2 | [[Docker Basics]] | Core workflow — images, containers, the run command |
| 3 | [[Docker Engine]] | How Docker actually runs containers — daemon, CLI, namespaces, cgroups |
| 3.5 | [[Docker Images]] | How images are built, layered, and stored |
| 3.6 | [[Docker Storage]] | Layered architecture, copy-on-write, volumes vs bind mounts |
| 4 | [[Compose file]] | Run multi-container apps locally with docker-compose |
| 5 | [[Micro-services]] | Architectural pattern Docker is built for — context for why you'd use Compose |
| 6 | [[Docker Swarm]] | Basic container orchestration — stepping stone to Kubernetes |
| 7 | [[FAQs]] | Common issues and gotchas — useful once you've hit your first errors |
| 8 | [[Docker Commands]] | Flags and commands explained from confusion — `-d`, `exec`, `-i`, `-p`, `-v`, `inspect`, `logs` |
| 9 | [[Docker Networking]] | Networks, ports, bridge/host/none, DNS, port mapping, load balancing |
| 10 | [[Docker Workflow]] | Where Docker Hub fits — build → ship → deploy, and what end users actually see |

> [!tip] After this → [[../Ansible/Ansible MOC|Ansible]] or [[../Kubernetes/Kubernetes MOC|Kubernetes]]

---

```dataviewjs
const pages = dv.pages('"Learning/DevOps/Docker"')
  .where(p => p.type !== "moc" && p.file.name !== "");

const wrap = dv.container.createEl("div");
wrap.style.cssText = "margin-bottom: 16px;";
const input = wrap.createEl("input");
input.type = "text";
input.placeholder = "search notes…";
input.style.cssText = "width:100%; padding:5px 10px; font-size:0.8em; letter-spacing:0.3px; border-radius:6px; border:1px solid var(--background-modifier-border); background:transparent; color:var(--text-muted); outline:none; box-sizing:border-box;";
input.addEventListener("focus", () => input.style.borderColor = "var(--text-faint)");
input.addEventListener("blur",  () => input.style.borderColor = "var(--background-modifier-border)");

const listEl = dv.container.createEl("div");
const items = [];

for (const p of pages.sort(p => p.file.name, 1).array()) {
  const div = listEl.createEl("div");
  div.style.cssText = "padding: 2px 0;";
  const a = div.createEl("a", { text: p.file.name, cls: "internal-link" });
  a.setAttribute("data-href", p.file.path);
  a.setAttribute("href", p.file.path);
  a.style.cssText = "font-size:0.88em; color:var(--text-normal); text-decoration:underline; text-decoration-color:rgba(255,255,255,0.12); text-underline-offset:2px;";
  items.push({ el: div, name: p.file.name.toLowerCase() });
}

input.addEventListener("input", () => {
  const q = input.value.toLowerCase().trim();
  items.forEach(({ el, name }) => { el.style.display = (!q || name.includes(q)) ? "" : "none"; });
});
```

---

## 🌱 Seeds

> [!seed]
> ```dataview
> LIST
> FROM "Learning/DevOps/Docker"
> WHERE status = "seed"
> SORT file.mtime ASC
> ```
