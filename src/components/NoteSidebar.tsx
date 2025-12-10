import { useState } from "react";
import { ChevronRight, Folder, FileText } from "lucide-react";
import { BlogPost } from "@/services/githubService";

interface DirectoryTree {
  [key: string]: {
    posts: BlogPost[];
    subdirs: DirectoryTree;
  };
}

interface NoteSidebarProps {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  onSelectPost: (post: BlogPost) => void;
}

const NoteSidebar = ({ posts, selectedPost, onSelectPost }: NoteSidebarProps) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // Build hierarchical directory tree
  const buildTree = (): DirectoryTree => {
    const tree: DirectoryTree = {};

    posts.forEach((post) => {
      const parts = post.folder.split('/');
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = { posts: [], subdirs: {} };
        }

        if (index === parts.length - 1) {
          current[part].posts.push(post);
        } else {
          current = current[part].subdirs;
        }
      });
    });

    return tree;
  };

  const toggleDir = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const tree = buildTree();

  // Recursive component for directory nodes
  const DirectoryNode = ({ name, node, path, level = 0 }: {
    name: string;
    node: any;
    path: string;
    level?: number;
  }) => {
    const isExpanded = expandedDirs.has(path);
    const hasSubdirs = Object.keys(node.subdirs).length > 0;
    const hasPosts = node.posts.length > 0;

    return (
      <div>
        <button
          onClick={() => toggleDir(path)}
          onMouseEnter={() => {
            if (!isExpanded && (hasSubdirs || hasPosts)) {
              setExpandedDirs(prev => new Set([...prev, path]));
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-white/10 rounded-lg transition-colors group"
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          <ChevronRight
            className={`h-3 w-3 text-foreground/50 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
          <Folder className="h-3.5 w-3.5 text-primary/70" />
          <span className="text-foreground/80 group-hover:text-foreground lowercase">
            {name}
          </span>
        </button>

        {isExpanded && (
          <div className="animate-in slide-in-from-top-1 duration-200">
            {/* Render subdirectories */}
            {hasSubdirs && Object.entries(node.subdirs).map(([subName, subNode]) => (
              <DirectoryNode
                key={`${path}/${subName}`}
                name={subName}
                node={subNode}
                path={`${path}/${subName}`}
                level={level + 1}
              />
            ))}

            {/* Render posts */}
            {hasPosts && node.posts.map((post: BlogPost) => (
              <button
                key={post.id}
                onClick={() => onSelectPost(post)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-white/10 rounded-lg transition-colors ${
                  selectedPost?.id === post.id ? 'bg-primary/10' : ''
                }`}
                style={{ paddingLeft: `${(level + 1) * 16 + 12}px` }}
              >
                <FileText className="h-3 w-3 text-foreground/40" />
                <span className="text-xs text-foreground/70 truncate">
                  {post.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-1">
        {Object.entries(tree).map(([dirName, node]) => (
          <DirectoryNode
            key={dirName}
            name={dirName}
            node={node}
            path={dirName}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteSidebar;
