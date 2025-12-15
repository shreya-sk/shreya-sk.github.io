interface TILItem {
  id: string;
  content: string;
  date: string;
}

interface TILCardProps {
  item: TILItem;
}

const TILCard = ({ item }: TILCardProps) => {
  // Format date to show day and date (e.g., "Monday, Jan 16")
  const formatDate = (dateString: string) => {
    if (!dateString) return { day: 'N/A', date: 'N/A' };
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
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
    <article className="journal-card rounded-2xl p-4 group hover:scale-[1.01] transition-all border-l-4 border-l-secondary/40 hover:border-l-secondary">
      <div className="flex gap-3">
        {/* Date column - styled like a journal tab */}
        <div className="flex-shrink-0 w-16 journal-date-tab">
          <div className="text-xs font-bold text-secondary uppercase tracking-wide">
            {day}
          </div>
          <div className="text-xs text-foreground/60 mt-0.5">
            {date}
          </div>
        </div>

        {/* Content - journal entry style */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground/80 leading-relaxed journal-text">
            {item.content || 'No content available'}
          </p>
        </div>
      </div>
    </article>
  );
};

export default TILCard;
