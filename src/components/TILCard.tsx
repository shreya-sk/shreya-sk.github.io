
import { Lightbulb, Calendar } from "lucide-react";

interface TILItem {
  id: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
}

interface TILCardProps {
  item: TILItem;
}

const TILCard = ({ item }: TILCardProps) => {
  return (
    <article className="rounded-lg border bg-card p-6 transition-all duration-200 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">{item.title}</h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={item.date}>{item.date}</time>
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed">
          {item.content}
        </p>
        
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default TILCard;
