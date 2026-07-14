// CodeMirror 6 markdown editor with live Obsidian syntax decoration
// and a rendered preview toggle.

import { useEffect, useRef, useState } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { obsidianSyntax } from './obsidianExtensions';

/** Preprocess Obsidian syntax into renderable HTML/markdown for preview. */
function obsidianToPreview(src: string): string {
  return src
    // embeds first: ![[Note]] → styled placeholder
    .replace(/!\[\[([^\]|\n]+)(\|[^\]\n]*)?\]\]/g, (_m, name) =>
      `<span class="obsidian-embed">📎 ${name}</span>`
    )
    // wikilinks: [[Note|alias]] → styled link
    .replace(/\[\[([^\]|\n]+)\|([^\]\n]+)\]\]/g, '<span class="obsidian-wikilink">$2</span>')
    .replace(/\[\[([^\]\n]+)\]\]/g, '<span class="obsidian-wikilink">$1</span>')
    // callouts: > [!note] Title → blockquote with badge
    .replace(/^>\s*\[!(\w+)\][+-]?\s*(.*)$/gm, (_m, type, title) =>
      `> <strong class="obsidian-callout-badge">${type.toUpperCase()}</strong> ${title}`
    );
}

interface MarkdownEditorProps {
  path: string;
  content: string;
  onChange: (path: string, content: string) => void;
  onWikilinkClick?: (target: string) => void;
}

export default function MarkdownEditor({ path, content, onChange, onWikilinkClick }: MarkdownEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [doc, setDoc] = useState(content);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // (Re)mount editor when the file changes
  useEffect(() => {
    setDoc(content);
    if (mode !== 'edit' || !hostRef.current) return;

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        syntaxHighlighting(defaultHighlightStyle),
        ...obsidianSyntax,
        EditorView.lineWrapping,
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            const text = u.state.doc.toString();
            setDoc(text);
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => onChange(path, text), 400);
          }
        }),
        EditorView.domEventHandlers({
          click: (e, view) => {
            const pos = view.posAtCoords({ x: e.clientX, y: e.clientY });
            if (pos == null || !onWikilinkClick) return false;
            const line = view.state.doc.lineAt(pos);
            const re = /!?\[\[([^\]|\n]+)(\|[^\]\n]*)?\]\]/g;
            let m: RegExpExecArray | null;
            while ((m = re.exec(line.text))) {
              const start = line.from + m.index;
              const end = start + m[0].length;
              if (pos >= start && pos <= end && (e.metaKey || e.ctrlKey)) {
                onWikilinkClick(m[1].trim());
                return true;
              }
            }
            return false;
          },
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    return () => {
      clearTimeout(debounceRef.current);
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, mode]);

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-sm font-medium truncate">{path}</span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={mode === 'edit' ? 'default' : 'ghost'}
            onClick={() => setMode('edit')}
          >
            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
          <Button
            size="sm"
            variant={mode === 'preview' ? 'default' : 'ghost'}
            onClick={() => setMode('preview')}
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> Preview
          </Button>
        </div>
      </div>

      {mode === 'edit' ? (
        <div ref={hostRef} className="flex-1 overflow-auto" />
      ) : (
        <div className="flex-1 overflow-auto px-6 py-4 prose prose-sm dark:prose-invert max-w-none obsidian-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {obsidianToPreview(doc)}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
