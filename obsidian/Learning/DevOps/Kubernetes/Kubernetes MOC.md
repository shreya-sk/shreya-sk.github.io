---
type: moc
up: "[[Learning/DevOps/DevOps MOC]]"
tags: [moc, area/devops, topic/kubernetes]
---

← [[Notes/HOME|Home]] &nbsp;·&nbsp; [[Notes/Learning MOC|Learning]] &nbsp;·&nbsp; [[Learning/DevOps/DevOps MOC|DevOps]]

# Kubernetes

> All Kubernetes notes. Currently studying for CKA — see [[CKA Prep MOC]] for the exam study guide.

## 🎯 Active Goal
[[CKA Prep MOC]]

---

## 🗺️ Start Here — Reading Order

> [!note] New to Kubernetes?
> Assumes you already understand [[../Docker/Docker MOC|Docker]] and containers. Kubernetes orchestrates containers — if you don't know what a container is, start there.

| Step | Note | Why |
|---|---|---|
| 1 | [[YAML - k8s]] | Kubernetes is 90% YAML — understand the format before reading any config |
| 2 | [[CKA prep]] | Core concepts: pods, deployments, services, namespaces — the K8s mental model |
| 3 | [[CKA Prep MOC]] | Structured study path if working toward the CKA exam |
| 4 | [[CKA - Cheat Sheet]] | Quick reference once you're familiar — not for first-time reading |

> [!tip] CKA exam prep? Follow [[CKA Prep MOC]] as your primary guide, use [[CKA - Cheat Sheet]] for revision.

---

```dataviewjs
const pages = dv.pages('"Learning/DevOps/Kubernetes"')
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
> FROM "Learning/DevOps/Kubernetes"
> WHERE status = "seed"
> SORT file.mtime ASC
> ```
