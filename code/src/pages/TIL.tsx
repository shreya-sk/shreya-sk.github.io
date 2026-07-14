import { useState, useMemo } from "react";
import WeekCalendar, { getWeekStart, getWeekDays, formatDateKey, DAY_NAMES } from "@/components/WeekCalendar";
import { useTILEntries } from "@/hooks/useTILEntries";
import { TILEntry } from "@/types/blog";

const TIL = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const { data: tilEntries = [], isLoading, error } = useTILEntries();

  // Calculate entry counts per day for the calendar
  const entryCounts = useMemo(() => {
    const counts: { [date: string]: number } = {};
    tilEntries.forEach(entry => {
      if (entry.date) {
        counts[entry.date] = (counts[entry.date] || 0) + 1;
      }
    });
    return counts;
  }, [tilEntries]);

  const weekStart = getWeekStart(selectedWeek);
  const weekDays = getWeekDays(weekStart);

  // Group this week's entries by day
  const entriesByDay = useMemo(() => {
    const groups: { [date: string]: TILEntry[] } = {};
    tilEntries.forEach(entry => {
      if (entry.date) {
        (groups[entry.date] = groups[entry.date] || []).push(entry);
      }
    });
    return groups;
  }, [tilEntries]);

  const weekEntryCount = weekDays.reduce(
    (sum, day) => sum + (entriesByDay[formatDateKey(day)]?.length || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-mono">loading journal entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl font-extrabold uppercase tracking-tighter">Failed to load entries</h2>
          <p className="text-muted-foreground text-sm font-mono">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sage-gradient">
      <div className="container px-6 py-14">
        <div className="mx-auto max-w-6xl">
          {/* Heading row */}
          <div className="mb-8 flex items-baseline justify-between">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
              my weekly learnings
            </h1>
            <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {weekEntryCount} {weekEntryCount === 1 ? 'entry' : 'entries'} this week
            </span>
          </div>

          {/* Horizontal week strip */}
          <WeekCalendar
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
            entryCounts={entryCounts}
          />

          {/* Day-by-day entries */}
          <div className="mt-12">
            {weekDays.map((day, i) => {
              const key = formatDateKey(day);
              const dayEntries = entriesByDay[key] || [];
              return (
                <div
                  key={key}
                  className="grid grid-cols-[80px_1fr] gap-6 py-6 border-b border-foreground/20"
                >
                  <div className="font-mono text-xs uppercase tracking-wide text-foreground/70">
                    <div>{DAY_NAMES[i]}</div>
                    <div className="mt-0.5">{day.getDate()}</div>
                  </div>
                  <div>
                    {dayEntries.length > 0 ? (
                      dayEntries.map((entry) => (
                        <p
                          key={entry.id}
                          className="text-base leading-relaxed mb-4 last:mb-0 whitespace-pre-line"
                        >
                          {entry.content || 'No content available'}
                        </p>
                      ))
                    ) : (
                      <p className="italic text-muted-foreground">snooze day</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TIL;
