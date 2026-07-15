---
type: moc
up: "[[Learning/DevOps/DevOps MOC]]"
tags: [moc, area/devops, topic/ansible]
---

← [[HOME|Home]] &nbsp;·&nbsp; [[Learning MOC|Learning]] &nbsp;·&nbsp; [[Learning/DevOps/DevOps MOC|DevOps]]

# Ansible

> All Ansible and automation notes.

---

## 🗺️ Start Here — Reading Order

> [!note] New to Ansible?
> Assumes you know Linux and SSH basics ([[../Pre-requisites Devops/LINUX|Linux notes]]). Ansible automates tasks you'd otherwise run manually on remote servers.

| Step | Note | Why |
|---|---|---|
| 1 | [[YAML]] | Ansible playbooks are written in YAML — essential to read this first |
| 2 | [[Ansible - What is]] | What Ansible is, how it works, when to use it vs alternatives |

> [!tip] Small section — read both. Then practice by writing a playbook that installs a package on a remote server.

---

```dataviewjs
const pages = dv.pages('"Learning/DevOps/Ansible"')
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
> FROM "Learning/DevOps/Ansible"
> WHERE status = "seed"
> SORT file.mtime ASC
> ```
