import { useState, useMemo } from "react";
import TILCard from "@/components/TILCard";
import WeekCalendar from "@/components/WeekCalendar";
import { useTILEntries } from "@/hooks/useTILEntries";

const TIL = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const { data: tilEntries = [], isLoading, error } = useTILEntries();

  // Get Sunday of the selected week
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Get week end (Saturday)
  const getWeekEnd = (weekStart: Date): Date => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  };

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

  // Filter TIL entries for the selected week
  const weekStart = getWeekStart(selectedWeek);
  const weekEnd = getWeekEnd(weekStart);

  const filteredEntries = tilEntries.filter(entry => {
    if (!entry || !entry.date) return false;
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground/60 text-sm">loading journal entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen sage-gradient flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground">Failed to load entries</h2>
          <p className="text-foreground/60 text-sm">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sage-gradient">
      <div className="h-screen px-4 py-4">
        {/* Single unified glass surface */}
        <div className="relative h-full liquid-glass-content rounded-3xl overflow-hidden shadow-2xl">
          {/* Week calendar pill floating on the left side of the surface */}
          <aside className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
            <div className="liquid-glass-pill rounded-3xl overflow-hidden shadow-2xl" style={{ width: '320px' }}>
              <WeekCalendar
                selectedWeek={selectedWeek}
                onWeekChange={setSelectedWeek}
                entryCounts={entryCounts}
              />
            </div>
          </aside>

          {/* TIL entries content - takes full surface */}
          <main className="h-full overflow-y-auto px-8 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  daily journal
                </h1>
                <p className="text-foreground/60 text-sm">
                  {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} this week
                </p>
              </div>

              <div className="space-y-3">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <TILCard key={entry.id} item={entry} />
                  ))
                ) : (
                  <div className="text-center py-16 minimal-card rounded-3xl">
                    <p className="text-foreground/60 text-sm">
                      no journal entries for this week
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TIL;
