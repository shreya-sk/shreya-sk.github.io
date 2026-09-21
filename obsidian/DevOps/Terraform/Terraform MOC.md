---
type: moc
up: "[[Learning/DevOps/DevOps MOC]]"
tags: [moc, devops, topic/terraform]
AutoNoteMover: disable
banner: "Attachments/Banners/banner-2.jpeg"
banner_y: 0.5
---

← [[Nav/HOME|Home]] &nbsp;·&nbsp; [[Learning MOC|Learning]] &nbsp;·&nbsp; [[Learning/DevOps/DevOps MOC|DevOps]]

# Terraform

> All Terraform and infrastructure-as-code notes.

---

## Start Here — Reading Order

> [!note] New to Terraform?
> Assumes basic Linux and cloud concepts. [[Learning/DevOps/Ansible/Ansible MOC|Ansible]] is a useful contrast — it configures servers, Terraform provisions them.

| Step | Note | Why |
|---|---|---|
| 1 | [[Terraform - What is?]] | What Terraform is, and where IaC fits |

---

```dataviewjs
const folder = dv.current().file.folder;
const pages = dv.pages('"' + folder + '"')
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

## Seeds

> [!seed]
> ```dataview
> LIST
> FROM "Learning/DevOps/Terraform"
> WHERE status = "seed"
> AND type != "moc"
> SORT file.mtime ASC
> ```
