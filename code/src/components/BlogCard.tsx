import { Calendar, Clock, ArrowUpRight, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/services/githubService";
import { cleanForExcerpt } from "@/utils/markdownUtils";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const readTime = Math.max(1, Math.ceil(post.content.length / 1000)) + " min read";

  const cleanContent = cleanForExcerpt(post.content);
  const excerpt = cleanContent.substring(0, 120) + (cleanContent.length > 120 ? '...' : '');

  let displayTitle = post.title;
  if (displayTitle.length > 80) {
    const firstSentence = displayTitle.split(/[.!?]/)[0];
    displayTitle = firstSentence.length > 0 && firstSentence.length < 80 
      ? firstSentence 
      : displayTitle.substring(0, 77) + '...';
  }

  return (
    <article className="group ios-card rounded-2xl p-6 relative overflow-hidden">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative space-y-4">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
            <Folder className="h-3 w-3 text-primary" />
            <span className="font-medium text-primary">{post.folder}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{readTime}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors duration-300">
          <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {displayTitle}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        {/* Read more */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-primary/80 group-hover:text-primary transition-colors">
          <span>read more</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
