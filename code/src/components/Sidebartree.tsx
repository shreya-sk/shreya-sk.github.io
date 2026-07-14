import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  post?: BlogPost;
}

interface SidebarTreeProps {
  posts: BlogPost[];
  selectedPath: string | null;
  onFileSelect: (post: BlogPost) => void;
}

// Find the "Hey, there!" post for default selection
const findDefaultPost = (posts: BlogPost[]): BlogPost | null => {
  const heyTherePost = posts.find(
    (post) =>
      post.title.toLowerCase().includes('hey') ||
      post.path.toLowerCase().includes('hey, there')
  );
  return heyTherePost || (posts.length > 0 ? posts[0] : null);
};

// Build hierarchical tree structure from flat posts array
const buildTree = (posts: BlogPost[]): TreeNode[] => {
  const tree: Map<string, TreeNode> = new Map();
  const root: TreeNode[] = [];

  posts.forEach((post) => {
    const parts = post.path.split('/');
    let currentPath = '';

    parts.forEach((part, index) => {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!tree.has(currentPath)) {
        const isFile = index === parts.length - 1;
        const node: TreeNode = {
          name: part.replace('.md', ''),
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          post: isFile ? post : undefined,
        };

        tree.set(currentPath, node);

        if (parentPath) {
          const parent = tree.get(parentPath);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        } else {
          root.push(node);
        }
      }
    });
  });

  return root;
};

// Recursive tree node — expands on click only, no hover behaviour
const TreeNodeComponent = ({
  node,
  level = 0,
  selectedPath,
  onFileSelect,
  expandedDirs,
  onToggleDir,
}: {
  node: TreeNode;
  level?: number;
  selectedPath: string | null;
  onFileSelect: (post: BlogPost) => void;
  expandedDirs: Set<string>;
  onToggleDir: (path: string) => void;
}) => {
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = expandedDirs.has(node.path);
  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (node.type === 'file' && node.post) {
      onFileSelect(node.post);
    } else if (isFolder) {
      onToggleDir(node.path);
    }
  };

  return (
    <div>
      <div
        className={`
          flex items-center gap-1.5 px-3 py-2 cursor-pointer select-none transition-colors
          ${isSelected ? 'bg-accent/10 border-l-2 border-accent' : 'border-l-2 border-transparent hover:bg-muted'}
        `}
        style={{ paddingLeft: `${12 + level * 14}px` }}
        onClick={handleClick}
      >
        {/* Chevron marks folders; files get a plain dash marker */}
        {isFolder ? (
          <ChevronRight
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${
              isOpen ? 'rotate-90 text-accent' : 'text-foreground/40'
            }`}
          />
        ) : (
          <span className="w-3.5 shrink-0 text-foreground/30 font-mono text-xs leading-none">–</span>
        )}

        <span
          className={`font-mono text-xs flex-1 truncate ${
            isSelected
              ? 'text-accent font-medium'
              : isFolder
                ? 'text-foreground uppercase tracking-wide'
                : 'text-foreground/80'
          }`}
        >
          {node.name}
        </span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onFileSelect={onFileSelect}
              expandedDirs={expandedDirs}
              onToggleDir={onToggleDir}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarTree = ({ posts, selectedPath, onFileSelect }: SidebarTreeProps) => {
  const tree = buildTree(posts);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // Auto-select "Hey, there!" on first load
  useEffect(() => {
    if (posts.length > 0 && !selectedPath) {
      const defaultPost = findDefaultPost(posts);
      if (defaultPost) {
        onFileSelect(defaultPost);
      }
    }
  }, [posts, selectedPath, onFileSelect]);

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div className="h-full w-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="py-3">
        <div className="mb-3 px-3 pb-2 border-b border-foreground/20">
          <h2 className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
            Notes
          </h2>
        </div>

        {tree.map((node) => (
          <TreeNodeComponent
            key={node.path}
            node={node}
            selectedPath={selectedPath}
            onFileSelect={onFileSelect}
            expandedDirs={expandedDirs}
            onToggleDir={toggleDir}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarTree;
