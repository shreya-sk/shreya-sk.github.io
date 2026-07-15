---
banner: "Attachments/home3.jpeg"
banner_y: 0.4
cssclasses: [moc-page]
type: moc
tags: [moc]
---

← [[HOME|Home]] &nbsp;&nbsp;|&nbsp;&nbsp; [[Learning/DevOps/DevOps MOC|DevOps]] &nbsp;·&nbsp; [[Learning/NLP - ABSA/Dashboard|NLP / ABSA]] &nbsp;·&nbsp; [[Learning/Kong/Kong API Gateway - Overview|Kong]] &nbsp;·&nbsp; [[Anatomy & Physiology MOC | Anatomy & Physiology]]

# Learning

```dataviewjs
const pages = dv.pages('"Learning"')
  .where(p => p.file.name !== "" && p.file.name !== ".");

// ── Build tree ──────────────────────────────────────
function makeNode() { return { files: [], dirs: {} }; }
const root = makeNode();

for (const page of pages) {
  const rel = page.file.path.replace(/^Learning\//, "");
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
input.addEventListener("focus",  () => input.style.borderColor = "var(--text-faint)");
input.addEventListener("blur",   () => input.style.borderColor = "var(--background-modifier-border)");

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
    // Top-level: bold heading style
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
    for (const [dn, dv_] of Object.entries(node.dirs)) renderDir(content, dv_, dn, depth + 1, newAnc);
  } else {
    // Nested: subtle collapsible
    details.style.cssText = "margin: 4px 0;";
    details.removeAttribute("open"); // nested closed by default
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
    for (const [dn, dv_] of Object.entries(node.dirs)) renderDir(content, dv_, dn, depth + 1, newAnc);
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
      // restore: top-level open, nested closed
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
