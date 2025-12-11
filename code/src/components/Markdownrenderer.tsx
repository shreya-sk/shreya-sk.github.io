import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Calendar, Clock } from 'lucide-react';
import { BlogPost } from '@/services/githubService';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  post: BlogPost | null;
}

const MarkdownRenderer = ({ post }: MarkdownRendererProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade out
    setIsVisible(false);
    
    // Fade in after content changes
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [post?.id]);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="text-4xl">📝</div>
          <p className="text-foreground/60 text-sm">Select a note to read</p>
        </div>
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil(post.content.length / 1000)) + " min read";

  return (
    <div
      className={`
        h-full overflow-y-auto custom-scrollbar
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <article className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <header className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-xs">
              <Clock className="h-3.5 w-3.5" />
              <span>{readTime}</span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </header>

        {/* Content */}
        <div className="markdown-content journal-text leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default MarkdownRenderer;
