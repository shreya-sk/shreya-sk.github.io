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
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <article className="journal-card rounded-2xl p-4 group hover:scale-[1.01] transition-all border-l-4 border-l-secondary/40 hover:border-l-secondary">
      <div className="flex gap-3">
        {/* Date column - styled like a journal tab */}
        <div className="flex-shrink-0 w-16 journal-date-tab">
          <div className="text-xs font-bold text-secondary uppercase tracking-wide">
            {formatDate(item.date).split(', ')[0]}
          </div>
          <div className="text-xs text-foreground/60 mt-0.5">
            {formatDate(item.date).split(', ')[1]}
          </div>
        </div>

        {/* Content - journal entry style */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground/80 leading-relaxed journal-text">
            {item.content}
          </p>
        </div>
      </div>
    </article>
  );
};

export default TILCard;
