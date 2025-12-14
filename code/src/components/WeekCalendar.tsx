import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekCalendarProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  entryCounts: { [date: string]: number };
}

const WeekCalendar = ({ selectedWeek, onWeekChange, entryCounts }: WeekCalendarProps) => {
  // Get Sunday of the current week
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust to Sunday
    return new Date(d.setDate(diff));
  };

  // Get the 7 days of the week (Sunday to Saturday)
  const getWeekDays = (weekStart: Date): Date[] => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Navigate to previous/next week
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    onWeekChange(newDate);
  };

  // Format date range for header
  const formatWeekRange = (weekStart: Date): string => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const suffix = day === 1 || day === 21 || day === 31 ? 'st'
        : day === 2 || day === 22 ? 'nd'
        : day === 3 || day === 23 ? 'rd'
        : 'th';
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      return `${day}${suffix} ${month}`;
    };

    const year = weekStart.getFullYear();
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)} ${year}`;
  };

  // Format date as YYYY-MM-DD for comparison
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const weekStart = getWeekStart(selectedWeek);
  const weekDays = getWeekDays(weekStart);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full flex flex-col p-6">
      {/* Week Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-full hover:bg-white/30 transition-all duration-200"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5 text-foreground/70" />
          </button>

          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-full hover:bg-white/30 transition-all duration-200"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5 text-foreground/70" />
          </button>
        </div>

        {/* Week Range */}
        <h3 className="text-xs font-semibold text-foreground/70 text-center uppercase tracking-wide">
          {formatWeekRange(weekStart)}
        </h3>
      </div>

      {/* Week Days */}
      <div className="flex-1 space-y-3">
        {weekDays.map((day, index) => {
          const dateKey = formatDateKey(day);
          const count = entryCounts[dateKey] || 0;
          const isToday = formatDateKey(new Date()) === dateKey;

          return (
            <div
              key={dateKey}
              className={`
                relative p-3 rounded-2xl transition-all duration-200
                ${count > 0
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/15 hover:from-primary/30 hover:to-secondary/25 cursor-pointer shadow-md'
                  : 'bg-white/10 hover:bg-white/20'
                }
                ${isToday ? 'ring-2 ring-primary/40' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    text-xs font-semibold uppercase tracking-wide
                    ${count > 0 ? 'text-primary' : 'text-foreground/50'}
                  `}>
                    {dayNames[index]}
                  </div>
                  <div className={`
                    text-sm font-medium
                    ${count > 0 ? 'text-foreground' : 'text-foreground/40'}
                  `}>
                    {day.getDate()}
                  </div>
                </div>

                {count > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/60">
                      {count} {count === 1 ? 'entry' : 'entries'}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
