
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="group relative rounded-lg border bg-card p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
          <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        
        <p className="text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center text-sm font-medium text-primary">
          Read more
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
