---
banner: "Attachments/home.png"
banner_y: 0.5
cssclasses: [moc-page]
type: moc
up: "[[Notes/Learning MOC]]"
tags: [moc, area/devops]
---

← [[Notes/HOME|Home]] &nbsp;·&nbsp; [[Notes/Learning MOC|Learning]] &nbsp;&nbsp;|&nbsp;&nbsp; [[Learning/DevOps/Docker/Docker MOC|Docker]] &nbsp;·&nbsp; [[Learning/DevOps/Kubernetes/Kubernetes MOC|Kubernetes]] &nbsp;·&nbsp; [[Learning/DevOps/GoLang/GoLang MOC|GoLang]] &nbsp;·&nbsp; [[Learning/DevOps/Ansible/Ansible MOC|Ansible]] &nbsp;·&nbsp; [[Learning/DevOps/Pre-requisites Devops/Prerequisites MOC|Prerequisites]]

# DevOps

> Top-level index for all DevOps learning. Each topic has its own MOC.

---

## 🗺️ Start Here — Reading Order

> [!note] New to DevOps? Follow this path.
> Each step builds on the last. Don't skip prerequisites — they're the reason things make sense later.

| Step | Topic | Where to start | Why first |
|---|---|---|---|
| 1 | **Prerequisites** | [[Pre-requisites Devops/Prerequisites MOC\|Prerequisites MOC]] | Everything else assumes Linux + networking knowledge |
| 2 | **Containers Overview** | [[Containers - Overview]] | Mental model for why containers exist before touching Docker |
| 3 | **Docker** | [[Docker/Docker MOC\|Docker MOC]] | Containers in practice — the tool you'll use daily |
| 4 | **12-Factor App** | [[12 Factor App - Method]] | Architecture principles that explain how to design containerised apps |
| 5 | **Ansible** | [[Ansible/Ansible MOC\|Ansible MOC]] | Automate infrastructure once you understand what you're provisioning |
| 6 | **GoLang** | [[GoLang/GoLang MOC\|GoLang MOC]] | Language used in Kubernetes internals + writing DevOps tooling |
| 7 | **Kubernetes** | [[Kubernetes/Kubernetes MOC\|Kubernetes MOC]] | Orchestrate containers at scale — the hardest topic, needs all prior context |

> [!tip] Already know Linux?
> Skip to Step 2. If you know Docker too, jump straight to [[12 Factor App - Method]] then [[Ansible/Ansible MOC|Ansible]].

---

```dataviewjs
// ── Dynamic Topics ──────────────────────────────────
const mocs = dv.pages('"Learning/DevOps"')
  .where(p => p.type === "moc" && p.file.name !== "DevOps MOC");

const topicsEl = dv.container.createEl("div");
topicsEl.style.cssText = "margin-bottom: 20px; font-size: 0.88em; color: var(--text-muted);";
const boldEl = topicsEl.createEl("strong", { text: "Topics" });
boldEl.style.cssText = "color: var(--text-normal);";
topicsEl.createEl("span", { text: "\u00a0\u00a0" });

mocs.array().forEach((p, i) => {
  const a = topicsEl.createEl("a", { text: p.file.name.replace(/ MOC$/, ""), cls: "internal-link" });
  a.setAttribute("data-href", p.file.path);
  a.setAttribute("href", p.file.path);
  a.style.cssText = "color: var(--text-muted); text-decoration: none;";
  if (i < mocs.length - 1) {
    topicsEl.createEl("span", { text: " | " }).style.cssText = "color: var(--text-faint);";
  }
});

// ── Build tree ──────────────────────────────────────
const pages = dv.pages('"Learning/DevOps"')
  .where(p => p.file.name !== "" && p.type !== "moc");

function makeNode() { return { files: [], dirs: {} }; }
const root = makeNode();

for (const page of pages) {
  const rel = page.file.path.replace(/^Learning\/DevOps\//, "");
  const parts = rel.split("/");
  let node = root;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!node.dirs[parts[i]]) node.dirs[parts[i]] = makeNode();
    node = node.dirs[parts[i]];
  }
  node.files.push(page);
}

// ── Search bar ──────────────────────────────────────
const searchWrap = dv.container.createEl("div");
searchWrap.style.cssText = "margin-bottom: 20px;";
const input = searchWrap.createEl("input");
input.type = "text";
input.placeholder = "search notes…";
input.style.cssText = `
  width: 100%;
  padding: 5px 10px;
  font-size: 0.8em;
  letter-spacing: 0.3px;
  border-radius: 6px;
  border: 1px solid var(--background-modifier-border);
  background: transparent;
  color: var(--text-muted);
  outline: none;
  box-sizing: border-box;
`;
input.addEventListener("focus", () => input.style.borderColor = "var(--text-faint)");
input.addEventListener("blur",  () => input.style.borderColor = "var(--background-modifier-border)");

// ── Tree ────────────────────────────────────────────
const treeEl = dv.container.createEl("div");
const allFileEls = [];

function renderFile(container, page, ancestors) {
  const div = container.createEl("div");
  div.style.cssText = "padding: 2px 0;";
  const a = div.createEl("a", { text: page.file.name, cls: "internal-link" });
  a.setAttribute("data-href", page.file.path);
  a.setAttribute("href", page.file.path);
  a.style.cssText = "font-size: 0.88em; color: var(--text-normal); text-decoration: underline; text-decoration-color: rgba(255,255,255,0.12); text-underline-offset: 2px;";
  allFileEls.push({ el: div, name: page.file.name.toLowerCase(), ancestors: [...ancestors] });
}

function renderDir(container, node, name, depth, ancestors) {
  const details = container.createEl("details");
  details.setAttribute("open", "");

  if (depth === 1) {
    details.style.cssText = "margin-top: 20px;";
    const summary = details.createEl("summary");
    summary.style.cssText = "display:flex; align-items:baseline; gap:8px; margin-bottom:8px; padding-bottom:5px; border-bottom:1px solid var(--background-modifier-border); cursor:pointer; list-style:none;";
    const arrow = summary.createEl("span");
    arrow.style.cssText = "font-size:0.7em; color:var(--text-faint); transition:transform 0.15s; display:inline-block;";
    arrow.textContent = "▾";
    summary.createEl("strong", { text: name }).style.cssText = "font-size:1em; font-weight:700; color:var(--text-normal); letter-spacing:0.3px;";
    details.addEventListener("toggle", () => {
      arrow.style.transform = details.open ? "rotate(0deg)" : "rotate(-90deg)";
    });
    const content = details.createEl("div");
    content.style.cssText = "margin-left: 6px;";
    const newAnc = [...ancestors, details];
    for (const page of node.files) renderFile(content, page, newAnc);
    for (const [dn, dnode] of Object.entries(node.dirs)) renderDir(content, dnode, dn, depth + 1, newAnc);
  } else {
    details.style.cssText = "margin: 4px 0;";
    details.removeAttribute("open");
    const summary = details.createEl("summary");
    summary.style.cssText = "cursor:pointer; color:var(--text-muted); font-size:0.88em; padding:2px 0; list-style:none; display:flex; align-items:center; gap:6px;";
    const arrow = summary.createEl("span");
    arrow.style.cssText = "font-size:0.7em; color:var(--text-faint); transition:transform 0.15s; display:inline-block; transform:rotate(-90deg);";
    arrow.textContent = "▾";
    summary.createEl("span", { text: name });
    details.addEventListener("toggle", () => {
      arrow.style.transform = details.open ? "rotate(0deg)" : "rotate(-90deg)";
    });
    const content = details.createEl("div");
    content.style.cssText = "margin-left: 16px; margin-top: 4px;";
    const newAnc = [...ancestors, details];
    for (const page of node.files) renderFile(content, page, newAnc);
    for (const [dn, dnode] of Object.entries(node.dirs)) renderDir(content, dnode, dn, depth + 1, newAnc);
  }
}

for (const page of root.files) renderFile(treeEl, page, []);
for (const [dirName, dirNode] of Object.entries(root.dirs)) {
  renderDir(treeEl, dirNode, dirName, 1, []);
}

// ── Search ──────────────────────────────────────────
input.addEventListener("input", () => {
  const q = input.value.toLowerCase().trim();
  if (!q) {
    allFileEls.forEach(({ el, ancestors }) => {
      el.style.display = "";
      ancestors.forEach((d, i) => i === 0 ? d.setAttribute("open","") : d.removeAttribute("open"));
    });
    return;
  }
  allFileEls.forEach(({ el }) => el.style.display = "none");
  allFileEls.forEach(({ el, name, ancestors }) => {
    if (name.includes(q)) {
      el.style.display = "";
      ancestors.forEach(d => d.setAttribute("open", ""));
    }
  });
});
```

---

## 🌱 Seeds — Needs Attention

> [!seed]
> ```dataview
> LIST
> FROM "Learning/DevOps"
> WHERE status = "seed"
> AND type != "moc"
> SORT file.mtime ASC
> ```
