
import { useParams } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "@/services/localMarkdownService";
import { usePageMeta } from "@/hooks/usePageMeta";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

const BlogPost = () => {
  const { "*": slug } = useParams();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchPostBySlug(slug || ''),
    enabled: !!slug,
  });

  usePageMeta(post?.title, post ? `${post.title} - notes from Shreya's digital diary.` : undefined);

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm font-mono">loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Post not found</p>
            <p className="text-muted-foreground">The post you're looking for doesn't exist or couldn't be loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil(post.content.length / 1000)) + " min read";

  return (
    <div className="container px-4 py-8 sage-gradient min-h-screen">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-all hover:gap-3 gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="minimal-card p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold uppercase tracking-tighter mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent font-mono text-xs uppercase tracking-wide">
                <Folder className="h-3.5 w-3.5" />
                <span>{post.folder}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted text-muted-foreground font-mono text-xs uppercase tracking-wide">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted text-muted-foreground font-mono text-xs uppercase tracking-wide">
                <Clock className="h-3.5 w-3.5" />
                <span>{readTime}</span>
              </div>
            </div>
          </header>
          
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              className="leading-relaxed"
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
