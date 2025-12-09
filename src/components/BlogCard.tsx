
import { Calendar, Clock, ArrowRight, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/services/githubService";
import { cleanForExcerpt } from "@/utils/markdownUtils";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Calculate approximate read time based on content length
  const readTime = Math.max(1, Math.ceil(post.content.length / 1000)) + " min read";

  // Extract clean excerpt from content
  const cleanContent = cleanForExcerpt(post.content);
  const excerpt = cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '');

  return (
    <article className="group relative rounded-2xl p-4 minimal-card border-l-4 border-l-primary/40 hover:border-l-primary transition-all">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10">
            <Folder className="h-3 w-3 text-primary" />
            <span className="font-medium text-primary">{post.folder}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.date} className="text-xs">{post.date}</time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{readTime}</span>
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
