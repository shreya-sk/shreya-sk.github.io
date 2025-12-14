import { useState, useRef, useEffect } from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { BlogPost } from '../types/blog';
import fileIcon from '../assets/file-icon.png';

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

// Recursive TreeNode component with hover-to-expand behavior
const TreeNodeComponent = ({
  node,
  level = 0,
  selectedPath,
  onFileSelect,
  onExpandedDepthChange,
}: {
  node: TreeNode;
  level?: number;
  selectedPath: string | null;
  onFileSelect: (post: BlogPost) => void;
  onExpandedDepthChange?: (depth: number, isExpanding: boolean) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    // Only handle clicks for files, not folders
    if (node.type === 'file' && node.post) {
      onFileSelect(node.post);
    }
  };

  // Simple hover handlers - prevent event bubbling to avoid interference
  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && !isHovered) {
      setIsHovered(true);
      // Notify parent of expansion depth
      onExpandedDepthChange?.(level, true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only collapse if mouse is truly leaving this node's entire area
    const relatedTarget = e.relatedTarget as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;

    // Check if we're moving to a descendant element
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }

    if (hasChildren && isHovered) {
      setIsHovered(false);
      // Notify parent of collapse
      onExpandedDepthChange?.(level, false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Node item - pill-like design */}
      <div
        className={`
          group relative flex items-center gap-2 px-3 py-2
          rounded-full transition-all duration-300 ease-out cursor-pointer
          ${isSelected
            ? 'bg-gradient-to-r from-primary/25 to-secondary/20 shadow-lg scale-[1.02]'
            : isHovered
              ? 'bg-white/50 shadow-md scale-[1.01]'
              : 'bg-white/20 hover:bg-white/30'
          }
        `}
        style={{ marginLeft: `${level * 8}px` }}
        onClick={handleClick}
      >
        {/* Icon */}
        {node.type === 'folder' ? (
          <img
            src={fileIcon}
            alt="folder"
            className={`h-4 w-4 transition-all duration-200 ${
              isHovered ? 'scale-110' : ''
            }`}
          />
        ) : (
          <FileText
            className={`h-4 w-4 transition-all duration-200 ${
              isSelected ? 'text-primary scale-110' : 'text-foreground/60'
            }`}
          />
        )}

        {/* Name */}
        <span
          className={`text-xs flex-1 truncate transition-all duration-200 ${
            isSelected
              ? 'text-primary font-semibold'
              : isHovered
                ? 'text-foreground font-medium'
                : 'text-foreground/80'
          }`}
        >
          {node.name}
        </span>

        {/* Chevron for folders */}
        {hasChildren && (
          <ChevronRight
            className={`
              h-3.5 w-3.5 transition-all duration-300 ease-out
              ${isHovered
                ? 'rotate-90 text-primary opacity-100'
                : 'rotate-0 text-foreground/30 opacity-70'
              }
            `}
          />
        )}
      </div>

      {/* Children (expanded on hover with smooth animation) */}
      {hasChildren && (
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-out
            ${isHovered
              ? 'max-h-[2000px] opacity-100 mt-1'
              : 'max-h-0 opacity-0 mt-0 pointer-events-none'
            }
          `}
        >
          <div className="space-y-1 pl-2">
            {node.children!.map((child) => (
              <TreeNodeComponent
                key={child.path}
                node={child}
                level={level + 1}
                selectedPath={selectedPath}
                onFileSelect={onFileSelect}
                onExpandedDepthChange={onExpandedDepthChange}
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
  const [maxExpandedDepth, setMaxExpandedDepth] = useState(0);
  const expandedDepthsRef = useRef<Set<number>>(new Set());

  // Auto-select "Hey, there!" on first load
  useEffect(() => {
    if (posts.length > 0 && !selectedPath) {
      const defaultPost = findDefaultPost(posts);
      if (defaultPost) {
        onFileSelect(defaultPost);
      }
    }
  }, [posts, selectedPath, onFileSelect]);

  const handleExpandedDepthChange = (depth: number, isExpanding: boolean) => {
    if (isExpanding) {
      expandedDepthsRef.current.add(depth);
    } else {
      expandedDepthsRef.current.delete(depth);
    }

    // Calculate max depth currently expanded
    const depths = Array.from(expandedDepthsRef.current);
    const newMaxDepth = depths.length > 0 ? Math.max(...depths) : 0;
    setMaxExpandedDepth(newMaxDepth);
  };

  // Calculate dynamic width based on expansion depth
  // Base: 350px (wide pill for full directory name visibility), add ~100px per level of nesting
  const baseWidth = 270;
  const widthPerLevel = 100;
  const calculatedWidth = baseWidth + (maxExpandedDepth * widthPerLevel);

  return (
    <div
      className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-200 ease-out flex flex-col justify-center"
      style={{ width: `${calculatedWidth}px` }}
    >
      <div className="p-4 space-y-2">
        <div className="mb-4 px-2">
          <h2 className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">
            Notes
          </h2>
        </div>

        {tree.map((node) => (
          <TreeNodeComponent
            key={node.path}
            node={node}
            selectedPath={selectedPath}
            onFileSelect={onFileSelect}
            onExpandedDepthChange={handleExpandedDepthChange}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarTree;
