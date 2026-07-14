// Reactive, expandable file-system tree mirroring the vault structure.

import { useMemo, useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNode {
  name: string;
  path: string;
  children?: TreeNode[]; // undefined = file
}

function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode = { name: '', path: '', children: [] };
  for (const p of paths.sort()) {
    const parts = p.split('/');
    let node = root;
    let acc = '';
    for (let i = 0; i < parts.length; i++) {
      acc = acc ? `${acc}/${parts[i]}` : parts[i];
      const isFile = i === parts.length - 1;
      let child = node.children!.find((c) => c.name === parts[i] && !!c.children !== isFile);
      if (!child) {
        child = { name: parts[i], path: acc, children: isFile ? undefined : [] };
        node.children!.push(child);
      }
      node = child;
    }
  }
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) =>
      !!b.children === !!a.children ? a.name.localeCompare(b.name) : a.children ? -1 : 1
    );
    nodes.forEach((n) => n.children && sort(n.children));
  };
  sort(root.children!);
  return root.children!;
}

interface FileTreeProps {
  paths: string[];
  dirtyPaths: string[];
  activePath?: string;
  onOpen: (path: string) => void;
  onNewFile: (folder: string) => void;
}

export default function FileTree({ paths, dirtyPaths, activePath, onOpen, onNewFile }: FileTreeProps) {
  const tree = useMemo(() => buildTree(paths), [paths]);
  const dirty = useMemo(() => new Set(dirtyPaths), [dirtyPaths]);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (path: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  const renderNode = (node: TreeNode, depth: number) => {
    const pad = { paddingLeft: `${depth * 14 + 8}px` };
    if (node.children) {
      const isOpen = open.has(node.path);
      return (
        <div key={`d:${node.path}`}>
          <div
            className="group flex items-center gap-1 py-1 pr-2 text-sm rounded cursor-pointer hover:bg-muted/60 select-none"
            style={pad}
            onClick={() => toggle(node.path)}
          >
            {isOpen ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            {isOpen ? <FolderOpen className="h-4 w-4 shrink-0 text-primary/70" /> : <Folder className="h-4 w-4 shrink-0 text-primary/70" />}
            <span className="truncate flex-1">{node.name}</span>
            <button
              title={`New note in ${node.name}`}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                onNewFile(node.path);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {isOpen && node.children.map((c) => renderNode(c, depth + 1))}
        </div>
      );
    }
    const isActive = node.path === activePath;
    return (
      <div
        key={`f:${node.path}`}
        className={cn(
          'flex items-center gap-1.5 py-1 pr-2 text-sm rounded cursor-pointer hover:bg-muted/60 select-none',
          isActive && 'bg-primary/10 text-primary font-medium'
        )}
        style={pad}
        onClick={() => onOpen(node.path)}
      >
        <FileText className="h-4 w-4 shrink-0 opacity-60" />
        <span className="truncate flex-1">{node.name.replace(/\.md$/, '')}</span>
        {dirty.has(node.path) && <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" title="Unsaved to Git" />}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto py-2">
      <div
        className="flex items-center gap-1.5 px-3 pb-2 text-xs uppercase tracking-wide text-muted-foreground cursor-pointer hover:text-foreground"
        onClick={() => onNewFile('')}
      >
        <Plus className="h-3.5 w-3.5" /> New note
      </div>
      {tree.map((n) => renderNode(n, 0))}
      {!tree.length && <p className="px-3 text-sm text-muted-foreground">Vault is empty.</p>}
    </div>
  );
}
