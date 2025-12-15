import { useState, useMemo } from "react";
import TILCard from "@/components/TILCard";
import WeekCalendar from "@/components/WeekCalendar";
import { useTILEntries } from "@/hooks/useTILEntries";
import { Lightbulb } from "lucide-react";

const TIL = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const { data: tilEntries = [], isLoading, error } = useTILEntries();

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getWeekEnd = (weekStart: Date): Date => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  };

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
  const weekEnd = getWeekEnd(weekStart);

  const filteredEntries = tilEntries.filter(entry => {
    if (!entry || !entry.date) return false;
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-secondary/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-muted-foreground">loading journal entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md ios-card rounded-3xl p-8">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground">Failed to load entries</h2>
          <p className="text-muted-foreground text-sm">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen liquid-gradient">
      {/* Background orbs */}
      <div className="glow-orb glow-orb-secondary w-[400px] h-[400px] top-20 -right-40" style={{ animationDelay: '0s' }}></div>
      <div className="glow-orb glow-orb-primary w-[300px] h-[300px] bottom-40 -left-20" style={{ animationDelay: '3s' }}></div>

      <div className="h-screen px-4 md:px-6 py-6">
        <div className="relative h-full ios-card rounded-3xl overflow-hidden">
          {/* Sidebar calendar - hidden on mobile */}
          <aside className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 z-10">
            <div className="ios-card rounded-2xl overflow-hidden" style={{ width: '300px' }}>
              <WeekCalendar
                selectedWeek={selectedWeek}
                onWeekChange={setSelectedWeek}
                entryCounts={entryCounts}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className="h-full overflow-y-auto ios-scrollbar px-6 md:px-8 py-8 lg:pl-[340px]">
            <div className="max-w-3xl mx-auto">
              {/* Mobile calendar */}
              <div className="lg:hidden mb-6">
                <div className="ios-card rounded-2xl overflow-hidden">
                  <WeekCalendar
                    selectedWeek={selectedWeek}
                    onWeekChange={setSelectedWeek}
                    entryCounts={entryCounts}
                  />
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg shadow-secondary/30">
                    <Lightbulb className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                      my weekly learnings
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} this week
                    </p>
                  </div>
                </div>
              </div>

              {/* Entries */}
              <div className="space-y-4">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <TILCard key={entry.id} item={entry} />
                  ))
                ) : (
                  <div className="text-center py-20 ios-card rounded-2xl">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-muted-foreground">
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
