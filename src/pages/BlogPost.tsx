import { useParams } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFileByPath, MarkdownFile } from "@/services/localMarkdownService";
import { BlogPost as BlogPostType } from "@/types/blog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

// Transform MarkdownFile to BlogPost format
const transformToPost = (file: MarkdownFile): BlogPostType => ({
  id: file.slug,
  title: file.title,
  content: file.content,
  path: file.path,
  folder: file.category || 'Root',
  date: new Date().toISOString().split('T')[0],
  slug: file.slug
});

const BlogPost = () => {
  const { "*": slug } = useParams();
  
  // Convert slug back to file path
  const filePath = slug ? decodeURIComponent(slug).replace(/-/g, ' ') + '.md' : '';
  
  const { data: file, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const f = await getFileByPath(filePath);
      return f ? transformToPost(f) : null;
    },
    enabled: !!slug,
  });
  
  const post = file;

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
    <div className="container px-4 py-8 sage-gradient min-h-screen">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-all hover:gap-3 gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="minimal-card rounded-3xl p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Folder className="h-3.5 w-3.5" />
                <span>{post.folder}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-sm">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-sm">
                <Clock className="h-3.5 w-3.5" />
                <span>{readTime}</span>
              </div>
            </div>
          </header>
          
          <div className="markdown-content leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
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
