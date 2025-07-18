
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
    <article className="rounded-lg bg-card/40 border border-border/40 p-8 transition-all duration-300 hover:bg-card/60 hover:border-border/60 minimal-card">
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500/80" />
            <h3 className="font-medium text-lg">{item.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
            <Calendar className="h-4 w-4" />
            <time dateTime={item.date}>{item.date}</time>
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
          {item.content}
        </p>
        
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary/80"
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
