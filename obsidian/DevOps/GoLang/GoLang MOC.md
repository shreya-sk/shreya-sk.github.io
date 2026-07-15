---
type: moc
up: "[[Learning/DevOps/DevOps MOC]]"
tags: [moc, area/devops, topic/golang]
---

← [[HOME|Home]] &nbsp;·&nbsp; [[Learning MOC|Learning]] &nbsp;·&nbsp; [[Learning/DevOps/DevOps MOC|DevOps]]

# GoLang

> Go programming notes — learned in a DevOps context.

---

## 🗺️ Start Here — Reading Order

> [!note] New to Go?
> Assumes you can read basic code in any language. Go is used heavily in DevOps tooling (Docker, Kubernetes, Terraform are all written in Go).

| Step | Note | Why |
|---|---|---|
| 1 | [[Go-Syntax]] | Language fundamentals — types, variables, functions, control flow |
| 2 | [[Pointers]] | The concept most newcomers to Go find tricky — understand this early |
| 3 | [[File IO]] | Reading and writing files — common in scripts and tooling |
| 4 | [[Gin]] | Web framework for building APIs — needs all the above as foundation |

> [!tip] After this → back to [[../Kubernetes/Kubernetes MOC|Kubernetes]] — the internals will make more sense now.

---

```dataviewjs
const pages = dv.pages('"Learning/DevOps/GoLang"')
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
> FROM "Learning/DevOps/GoLang"
> WHERE status = "seed"
> SORT file.mtime ASC
> ```
