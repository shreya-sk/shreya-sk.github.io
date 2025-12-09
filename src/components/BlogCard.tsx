
import { Calendar, Clock, ArrowRight, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/services/githubService";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Calculate approximate read time based on content length
  const readTime = Math.max(1, Math.ceil(post.content.length / 1000)) + " min read";
  
  // Extract excerpt from content (first paragraph or first 150 chars)
  const excerpt = post.content
    .replace(/^#.*$/gm, '') // Remove headings
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
    .substring(0, 120) + (post.content.length > 120 ? '...' : '');

  return (
    <article className="group relative rounded-2xl p-5 minimal-card">
      <div className="space-y-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground/80">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            <span className="font-medium">{post.folder}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-medium leading-snug group-hover:text-primary transition-colors">
          <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>

        <p className="text-muted-foreground leading-relaxed text-sm">
          {excerpt}
        </p>

        <div className="flex items-center text-xs font-medium text-primary/80 group-hover:text-primary transition-colors">
          read more
          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
