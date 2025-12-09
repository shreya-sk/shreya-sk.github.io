
import { useParams } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "@/services/githubService";
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

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
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
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
        
        <article className="prose prose-gray max-w-none dark:prose-invert">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Folder className="h-4 w-4" />
                <span>{post.folder}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
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
