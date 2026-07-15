---
banner: "Attachments/home2.jpeg"
banner_y: 0.3
cssclasses: [moc-page]
type: moc
tags: [moc]
---
```dataviewjs
const root = dv.container;

// ── header ───────────────────────────────────────────────────
const hdr = root.createEl("div");
hdr.style.cssText = "display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:28px;";

const hLeft = hdr.createEl("div");
hLeft.style.cssText = "display:flex; flex-direction:column; gap:2px;";
hLeft.createEl("span", { text: "moc" }).style.cssText =
  "font-size:0.65em; font-weight:700; letter-spacing:4px; color:var(--text-faint); text-transform:uppercase;";
hLeft.createEl("span", { text: "Seed Box" }).style.cssText =
  "font-size:1.5em; font-weight:300; letter-spacing:1px; color:var(--text-normal);";

const homeA = hdr.createEl("a", { text: "← Home", cls: "internal-link" });
homeA.setAttribute("data-href", "Notes/HOME"); homeA.setAttribute("href", "Notes/HOME");
homeA.style.cssText = "color:var(--text-faint); text-decoration:none; font-size:0.8em; padding-bottom:4px;";

// ── info callout ─────────────────────────────────────────────
const info = root.createEl("div");
info.style.cssText = `
  margin-bottom:28px; padding:10px 16px; border-radius:8px;
  background:rgba(120,120,128,0.07); border:1px solid rgba(120,120,128,0.15);
  font-size:0.82em; color:var(--text-muted); line-height:1.6;
`;
info.innerHTML = "Set <code>status: seed</code> in a note's frontmatter to collect it here. Change to <code>status: evergreen</code> when it matures.";

function makeSection(num, label) {
  const sec = root.createEl("div");
  sec.style.cssText = "margin-bottom:32px;";
  const h = sec.createEl("div");
  h.style.cssText = "display:flex; align-items:baseline; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--background-modifier-border);";
  h.createEl("span", { text: num }).style.cssText =
    "font-size:0.65em; font-weight:700; letter-spacing:3px; color:var(--text-faint); text-transform:uppercase;";
  h.createEl("span", { text: label }).style.cssText =
    "font-size:1em; font-weight:600; color:var(--text-normal);";
  const ul = sec.createEl("ul");
  ul.style.cssText = "list-style:none; padding:0; margin:0;";
  return ul;
}

// ── 01 Seeds in Progress ─────────────────────────────────────
const seeds = dv.pages()
  .where(p => p.status === "seed" && !p.file.path.includes("Templates/"))
  .sort(p => p.file.mtime, "asc");

const ul1 = makeSection("01", `Seeds in Progress  ·  ${seeds.length}`);

if (seeds.length === 0) {
  ul1.createEl("li", { text: "No seeds yet — add status: seed to any note." })
    .style.cssText = "padding:12px 0; font-size:0.86em; color:var(--text-faint); font-style:italic;";
} else {
  for (const p of seeds) {
    const li = ul1.createEl("li");
    li.style.cssText = "padding:7px 0; border-bottom:1px solid var(--background-modifier-border); display:flex; align-items:center; gap:12px; font-size:0.86em;";

    // Age indicator
    const daysOld = Math.floor(dv.luxon.DateTime.now().diff(p.file.mtime, "days").days);
    const ageColor = daysOld > 14 ? "#d97706" : daysOld > 7 ? "var(--text-muted)" : "var(--text-faint)";
    li.createEl("span", { text: `${daysOld}d` }).style.cssText =
      `font-size:0.74em; color:${ageColor}; min-width:28px; flex-shrink:0; font-variant-numeric:tabular-nums;`;

    const a = li.createEl("a", { text: p.file.name, cls: "internal-link" });
    a.setAttribute("data-href", p.file.path); a.setAttribute("href", p.file.path);
    a.style.cssText = "color:var(--text-normal); text-decoration:underline; text-decoration-color:rgba(0,0,0,0.15); text-underline-offset:2px; flex:1;";

    // Tags
    if (p.tags && p.tags.length > 0) {
      const tagList = Array.isArray(p.tags) ? p.tags : [p.tags];
      const filtered = tagList.filter(t => t !== "type/note" && t !== "seed");
      if (filtered.length > 0) {
        li.createEl("span", { text: filtered[0] }).style.cssText =
          "font-size:0.74em; color:var(--text-faint); flex-shrink:0;";
      }
    }
  }
}

// ── 02 Recently Graduated ────────────────────────────────────
const graduated = dv.pages()
  .where(p => p.status === "evergreen" && !p.file.path.includes("Templates/"))
  .sort(p => p.file.mtime, "desc")
  .limit(10);

const ul2 = makeSection("02", "Recently Graduated");

if (graduated.length === 0) {
  ul2.createEl("li", { text: "No evergreen notes yet." })
    .style.cssText = "padding:12px 0; font-size:0.86em; color:var(--text-faint); font-style:italic;";
} else {
  for (const p of graduated) {
    const li = ul2.createEl("li");
    li.style.cssText = "padding:7px 0; border-bottom:1px solid var(--background-modifier-border); display:flex; align-items:center; gap:12px; font-size:0.86em;";

    li.createEl("span", { text: "🌿" }).style.cssText = "flex-shrink:0; font-size:0.9em;";

    const a = li.createEl("a", { text: p.file.name, cls: "internal-link" });
    a.setAttribute("data-href", p.file.path); a.setAttribute("href", p.file.path);
    a.style.cssText = "color:var(--text-normal); text-decoration:underline; text-decoration-color:rgba(0,0,0,0.15); text-underline-offset:2px; flex:1;";

    li.createEl("span", { text: p.file.mtime.toFormat("d MMM") }).style.cssText =
      "font-size:0.76em; color:var(--text-faint); flex-shrink:0;";
  }
}
```
