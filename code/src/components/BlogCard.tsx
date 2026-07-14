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

  // Extract clean excerpt from content - get first paragraph after title
  const cleanContent = cleanForExcerpt(post.content);
  // Take first 120 characters for a more compact excerpt
  const excerpt = cleanContent.substring(0, 120) + (cleanContent.length > 120 ? '...' : '');

  // Extract just the first line or first sentence as title if it's too long
  let displayTitle = post.title;
  if (displayTitle.length > 80) {
    // If title is too long, take first sentence or first 80 chars
    const firstSentence = displayTitle.split(/[.!?]/)[0];
    displayTitle = firstSentence.length > 0 && firstSentence.length < 80 
      ? firstSentence 
      : displayTitle.substring(0, 77) + '...';
  }

  return (
    <article className="group relative p-4 border border-foreground/20 hover:bg-accent/5 transition-colors">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          <div className="flex items-center gap-1.5 px-2 py-0.5 border border-foreground/20 text-accent">
            <Folder className="h-3 w-3" />
            <span>{post.folder}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{readTime}</span>
          </div>
        </div>

        <h3 className="text-lg font-extrabold tracking-tight leading-snug group-hover:text-accent transition-colors line-clamp-2">
          <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {displayTitle}
          </Link>
        </h3>

        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">
          {excerpt}
        </p>

        <div className="flex items-center font-mono text-[11px] uppercase tracking-wide text-accent transition-colors">
          read more
          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
