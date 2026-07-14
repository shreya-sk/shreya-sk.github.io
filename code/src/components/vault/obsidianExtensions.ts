// CodeMirror 6 extension: live decoration of Obsidian syntax —
// [[wikilinks]], ![[embeds]], and > [!type] callout blocks.

import {
  Decoration,
  DecorationSet,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
} from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

// ---- inline: wikilinks & embeds ----

const inlineMatcher = new MatchDecorator({
  regexp: /(!)?\[\[([^\]\n]+)\]\]/g,
  decoration: (match) =>
    Decoration.mark({
      class: match[1] ? 'cm-obsidian-embed' : 'cm-obsidian-wikilink',
    }),
});

const wikilinkPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = inlineMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.decorations = inlineMatcher.updateDeco(update, this.decorations);
    }
  },
  { decorations: (v) => v.decorations }
);

// ---- line: callouts ----

const CALLOUT_RE = /^>\s*\[!(\w+)\][+-]?/;

const calloutPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.build(update.view);
      }
    }
    build(view: EditorView): DecorationSet {
      const builder: Array<{ from: number; deco: Decoration }> = [];
      for (const { from, to } of view.visibleRanges) {
        let pos = from;
        while (pos <= to) {
          const line = view.state.doc.lineAt(pos);
          const m = CALLOUT_RE.exec(line.text);
          if (m) {
            builder.push({
              from: line.from,
              deco: Decoration.line({ class: `cm-obsidian-callout cm-callout-${m[1].toLowerCase()}` }),
            });
          } else if (/^>\s/.test(line.text)) {
            // continuation lines of a callout get a subtle style too
            builder.push({ from: line.from, deco: Decoration.line({ class: 'cm-obsidian-quote' }) });
          }
          pos = line.to + 1;
        }
      }
      const b = new RangeSetBuilder<Decoration>();
      for (const { from, deco } of builder) b.add(from, from, deco);
      return b.finish();
    }
  },
  { decorations: (v) => v.decorations }
);

// ---- theme ----

const obsidianTheme = EditorView.theme({
  '.cm-obsidian-wikilink': {
    color: 'hsl(var(--primary))',
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
    cursor: 'pointer',
  },
  '.cm-obsidian-embed': {
    color: 'hsl(var(--primary))',
    fontStyle: 'italic',
    backgroundColor: 'hsl(var(--primary) / 0.08)',
    borderRadius: '3px',
  },
  '.cm-obsidian-callout': {
    backgroundColor: 'hsl(var(--primary) / 0.08)',
    borderLeft: '3px solid hsl(var(--primary))',
    fontWeight: '600',
  },
  '.cm-obsidian-quote': {
    backgroundColor: 'hsl(var(--muted) / 0.4)',
    borderLeft: '3px solid hsl(var(--border))',
  },
  '&': { fontSize: '14px' },
  '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
});

export const obsidianSyntax = [wikilinkPlugin, calloutPlugin, obsidianTheme];
