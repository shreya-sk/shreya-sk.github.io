interface TILItem {
  id: string;
  content: string;
  date: string;
}

interface TILCardProps {
  item: TILItem;
}

const TILCard = ({ item }: TILCardProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return { day: 'N/A', date: 'N/A' };
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return { day: 'N/A', date: dateString };
      }
      
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      };
      const formatted = date.toLocaleDateString('en-US', options);
      const parts = formatted.split(', ');
      
      return {
        day: parts[0] || 'N/A',
        date: parts[1] || 'N/A'
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { day: 'N/A', date: dateString };
    }
  };

  const { day, date } = formatDate(item.date);

  return (
    <article className="group ios-card rounded-2xl p-5 hover:border-secondary/40 transition-all duration-300">
      <div className="flex gap-4">
        {/* Date column */}
        <div className="flex-shrink-0 w-16">
          <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
            <div className="text-xs font-bold text-secondary uppercase tracking-wide">
              {day}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {date}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground/80 leading-relaxed">
            {item.content || 'No content available'}
          </p>
        </div>
      </div>
    </article>
  );
};

export default TILCard;
