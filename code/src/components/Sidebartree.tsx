import { useState, useRef } from 'react';
import { Folder, FileText, ChevronRight } from 'lucide-react';
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

// Recursive TreeNode component
const TreeNodeComponent = ({
  node,
  level = 0,
  selectedPath,
  onFileSelect,
}: {
  node: TreeNode;
  level?: number;
  selectedPath: string | null;
  onFileSelect: (post: BlogPost) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (node.type === 'file' && node.post) {
      onFileSelect(node.post);
    }
  };

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    collapseTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Node item */}
      <div
        className={`
          group relative flex items-center gap-2 px-3 py-2 rounded-xl
          transition-all duration-300 cursor-pointer
          ${isSelected ? 'bg-gradient-to-r from-primary/20 to-secondary/20 shadow-sm' : 'hover:bg-white/40'}
          ${level > 0 ? 'ml-4' : ''}
        `}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={handleClick}
      >
        {/* Icon */}
        {node.type === 'folder' ? (
          <Folder className={`h-4 w-4 transition-colors ${isHovered ? 'text-primary' : 'text-foreground/60'}`} />
        ) : (
          <FileText className={`h-4 w-4 transition-colors ${isSelected ? 'text-primary' : 'text-foreground/60'}`} />
        )}

        {/* Name */}
        <span className={`text-sm flex-1 transition-colors ${isSelected ? 'text-primary font-medium' : 'text-foreground/80'}`}>
          {node.name}
        </span>

        {/* Chevron for folders */}
        {hasChildren && (
          <ChevronRight 
            className={`h-3 w-3 text-foreground/40 transition-transform duration-300 ${isHovered ? 'rotate-90 text-primary' : ''}`}
          />
        )}

        {/* Hover glow effect */}
        {isHovered && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none" />
        )}
      </div>

      {/* Children (expanded on hover) */}
      {hasChildren && (
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isHovered ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="mt-1 space-y-1">
            {node.children!.map((child) => (
              <TreeNodeComponent
                key={child.path}
                node={child}
                level={level + 1}
                selectedPath={selectedPath}
                onFileSelect={onFileSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarTree = ({ posts, selectedPath, onFileSelect }: SidebarTreeProps) => {
  const tree = buildTree(posts);

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="p-4 space-y-1">
        <div className="mb-4 px-3">
          <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">
            Notes
          </h2>
        </div>
        
        {tree.map((node) => (
          <TreeNodeComponent
            key={node.path}
            node={node}
            selectedPath={selectedPath}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
};
