import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WeekCalendarProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  entryCounts: { [date: string]: number };
}

// Get Sunday of the current week
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Adjust to Sunday
  return new Date(d.setDate(diff));
};

// Get the 7 days of the week (Sunday to Saturday)
export const getWeekDays = (weekStart: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
};

// Format date as YYYY-MM-DD for comparison (local time, not UTC)
export const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Horizontal week strip: ← [ SUN | MON | ... | SAT ] →
const WeekCalendar = ({ selectedWeek, onWeekChange, entryCounts }: WeekCalendarProps) => {
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    onWeekChange(newDate);
  };

  const formatWeekRange = (weekStart: Date): string => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const fmt = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(weekStart)} — ${fmt(weekEnd)}`;
  };

  const weekStart = getWeekStart(selectedWeek);
  const weekDays = getWeekDays(weekStart);
  const todayKey = formatDateKey(new Date());

  return (
    <div>
      {/* Week range */}
      <div className="text-center font-mono text-xs uppercase tracking-wide text-muted-foreground mb-4">
        {formatWeekRange(weekStart)}
      </div>

      {/* Strip */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-3 border border-foreground/20 hover:border-accent hover:text-accent transition-colors"
          aria-label="Previous week"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 grid grid-cols-7 border border-foreground/20">
          {weekDays.map((day, i) => {
            const key = formatDateKey(day);
            const isToday = key === todayKey;
            const hasEntries = (entryCounts[key] || 0) > 0;
            return (
              <div
                key={key}
                className={`text-center py-4 border-r border-foreground/20 last:border-r-0 transition-colors ${
                  isToday ? 'bg-accent/10' : ''
                }`}
              >
                <div
                  className={`font-mono text-xs uppercase tracking-wide mb-1 ${
                    isToday ? 'text-accent' : hasEntries ? 'text-foreground/70' : 'text-foreground/40'
                  }`}
                >
                  {DAY_NAMES[i]}
                </div>
                <div className={`text-2xl font-extrabold ${isToday ? 'text-accent' : hasEntries ? '' : 'text-foreground/40'}`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigateWeek('next')}
          className="p-3 border border-foreground/20 hover:border-accent hover:text-accent transition-colors"
          aria-label="Next week"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default WeekCalendar;
