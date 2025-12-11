import { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";
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
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-white/10 rounded-xl transition-all duration-200 group"
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          <ChevronRight
            className={`h-3.5 w-3.5 text-foreground/40 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
          {/* Use file-icon.png instead of Lucide Folder icon */}
          <img
            src="/file-icon.png"
            alt="folder"
            className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-foreground/80 group-hover:text-foreground font-medium lowercase tracking-wide">
            {name}
          </span>
        </button>

        {isExpanded && (
          <div className="animate-in slide-in-from-top-1 duration-200 ease-out">
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
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-white/10 rounded-xl transition-all duration-200 ${
                  selectedPost?.id === post.id
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-l-2 border-primary'
                    : ''
                }`}
                style={{ paddingLeft: `${(level + 1) * 16 + 12}px` }}
              >
                <FileText className="h-3 w-3 text-foreground/40" />
                <span className="text-xs text-foreground/70 truncate hover:text-foreground transition-colors">
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
    <div className="h-full overflow-y-auto ios-scrollbar px-2 py-3">
      <div className="space-y-1">
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
