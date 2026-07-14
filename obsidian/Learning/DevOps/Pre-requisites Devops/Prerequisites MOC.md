---
type: moc
up: "[[Learning/DevOps/DevOps MOC]]"
tags: [moc, area/devops]
---

← [[Notes/HOME|Home]] &nbsp;·&nbsp; [[Notes/Learning MOC|Learning]] &nbsp;·&nbsp; [[Learning/DevOps/DevOps MOC|DevOps]]

# Prerequisites

> Linux, networking, shell scripting — the foundations everything else builds on.

---

## 🗺️ Start Here — Reading Order

> [!note] These are the foundations. Don't skip them.
> Every DevOps tool runs on Linux. Every script uses shell. Every service needs networking.

| Step | Note | Why |
|---|---|---|
| 1 | [[LINUX]] | The operating system everything runs on — commands, filesystem, permissions |
| 2 | [[Shell Scripting]] | Automate Linux tasks — loops, variables, conditionals, scripts |
| 3 | [[Networking (ON LINUX)]] | How services talk to each other — IPs, ports, DNS, firewalls |
| 4 | [[Devops Tools]] | Survey of the landscape — understand what each tool is for before diving in |

> [!tip] After this → [[../Docker/Docker MOC|Docker]]

---

```dataviewjs
const pages = dv.pages('"Learning/DevOps/Pre-requisites Devops"')
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
> FROM "Learning/DevOps/Pre-requisites Devops"
> WHERE status = "seed"
> SORT file.mtime ASC
> ```
