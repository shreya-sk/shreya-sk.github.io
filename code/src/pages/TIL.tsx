import { usePageMeta } from "@/hooks/usePageMeta";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateKey, DAY_NAMES } from "@/components/WeekCalendar";
import { tilPreviewText } from "@/utils/markdownUtils";
import { useTILEntries } from "@/hooks/useTILEntries";
import { TILEntry } from "@/types/blog";

// Vault filename convention for a daily TIL note, e.g. 09-09-2026.md
const tilFilename = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}-${m}-${date.getFullYear()}.md`;
};

// entry.date is an ISO "YYYY-MM-DD" string - format it for the modal title
const formatFullDate = (isoDate: string): string => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

// Flat list of every cell in a month's grid (Sunday-start), including the
// leading/trailing days from adjacent months needed to fill whole weeks.
const getMonthCells = (monthDate: Date): Date[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Date[] = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(new Date(year, month, i - startDay + 1));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }
  return cells;
};

const TIL = () => {
  usePageMeta('TIL', 'Today I Learned - a monthly log of small learnings.');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [expandedEntry, setExpandedEntry] = useState<TILEntry | null>(null);
  const { data: tilEntries = [], isLoading, error } = useTILEntries();

  const todayKey = formatDateKey(new Date());

  // Group entries by day, once, regardless of which month is showing
  const entriesByDay = useMemo(() => {
    const groups: { [date: string]: TILEntry[] } = {};
    tilEntries.forEach((entry) => {
      if (entry.date) {
        (groups[entry.date] = groups[entry.date] || []).push(entry);
      }
    });
    return groups;
  }, [tilEntries]);

  const monthCells = useMemo(() => getMonthCells(selectedMonth), [selectedMonth]);

  const monthEntryCount = useMemo(() => {
    const y = selectedMonth.getFullYear();
    const m = selectedMonth.getMonth();
    return tilEntries.filter((e) => {
      if (!e.date) return false;
      const [ey, em] = e.date.split('-').map(Number);
      return ey === y && em - 1 === m;
    }).length;
  }, [tilEntries, selectedMonth]);

  const changeMonth = (delta: number) => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

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
              today I learned
            </h1>
            <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {monthEntryCount} {monthEntryCount === 1 ? 'entry' : 'entries'} this month
            </span>
          </div>

          {/* Month header + nav */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-2 border border-foreground/20 hover:border-accent hover:text-accent transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-2 border border-foreground/20 hover:border-accent hover:text-accent transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="font-extrabold uppercase tracking-tight text-lg">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Weekday header row */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground pb-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 gap-1.5 mb-4">
            {monthCells.map((day) => {
              const key = formatDateKey(day);
              const inMonth = day.getMonth() === selectedMonth.getMonth();
              const isToday = key === todayKey;
              const dayEntries = entriesByDay[key] || [];
              const hasEntry = dayEntries.length > 0;
              const canAdd = inMonth && !hasEntry && key <= todayKey;

              const cellClasses = `relative flex flex-col text-left border p-2 min-h-[84px] md:min-h-[104px] transition-colors group ${
                isToday ? 'border-accent border-2' : 'border-foreground/20'
              } ${!inMonth ? 'opacity-30' : ''} ${hasEntry || canAdd ? 'hover:border-accent' : ''}`;

              const dayNumber = (
                <div className={`text-sm font-extrabold ${isToday ? 'text-accent' : ''}`}>
                  {day.getDate()}
                </div>
              );

              if (hasEntry) {
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setExpandedEntry(dayEntries[0])}
                    className={cellClasses}
                  >
                    {dayNumber}
                    <div className="mt-1 text-[11px] leading-snug text-foreground/80 line-clamp-3 [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
                      {tilPreviewText(dayEntries[0].content || '', 140)}
                    </div>
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-accent" />
                  </button>
                );
              }

              if (canAdd) {
                return (
                  <Link
                    key={key}
                    to={`/editor?path=${encodeURIComponent(`obsidian/Daily - TIL/${tilFilename(day)}`)}&create=1`}
                    className={cellClasses}
                    title="Add an entry for this day"
                  >
                    {dayNumber}
                    <Plus className="h-3.5 w-3.5 mt-auto mb-0.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              }

              return (
                <div key={key} className={cellClasses}>
                  {dayNumber}
                </div>
              );
            })}
          </div>

          <div className="flex gap-5 font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" /> has an entry
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 border-2 border-accent inline-block" /> today
            </span>
          </div>
        </div>
      </div>

      <Dialog open={!!expandedEntry} onOpenChange={(open) => !open && setExpandedEntry(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl">
          <DialogHeader className="flex-row items-center justify-between gap-3 space-y-0 pr-8">
            <DialogTitle className="font-mono text-sm uppercase tracking-wide text-accent">
              {expandedEntry && formatFullDate(expandedEntry.date)}
            </DialogTitle>
            {expandedEntry && (
              <Link
                to={`/editor?path=${encodeURIComponent(`obsidian/${expandedEntry.path}`)}`}
                className="shrink-0 text-muted-foreground hover:text-accent transition-colors"
                title="Edit this entry in the vault editor"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            )}
          </DialogHeader>
          <div className="markdown-content leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {expandedEntry?.content || ''}
            </ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TIL;
