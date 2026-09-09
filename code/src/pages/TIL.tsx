import { usePageMeta } from "@/hooks/usePageMeta";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WeekCalendar, { getWeekStart, getWeekDays, formatDateKey, DAY_NAMES } from "@/components/WeekCalendar";
import { useTILEntries } from "@/hooks/useTILEntries";
import { TILEntry } from "@/types/blog";

// Strip markdown syntax + the filename heading so entries read as plain text
const cleanTILContent = (raw: string): string => {
  return raw
    .replace(/^---[\s\S]*?---\s*/, '') // frontmatter
    .split('\n')
    .map((l) =>
      l
        .replace(/^\s{0,3}#{1,6}\s+/, '') // heading markers
        .replace(/^\s{0,3}>\s?/, '') // blockquote markers
        .replace(/^\s{0,3}[-*+]\s+/, '• ') // bullets
    )
    // drop date-only lines (the note's filename H1, e.g. "14-07-2026")
    .filter((l) => !/^\d{1,2}\s*-\s*\d{1,2}\s*-\s*\d{4}$/.test(l.trim()))
    .join('\n')
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italics
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/\n{3,}/g, '\n\n') // collapse extra blank lines
    .trim();
};

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

const TIL = () => {
  usePageMeta('TIL', 'Today I Learned - a weekly log of small learnings.');
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [expandedEntry, setExpandedEntry] = useState<TILEntry | null>(null);
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
  const todayKey = formatDateKey(new Date());

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
                        <div key={entry.id} className="group flex items-start gap-2 mb-4 last:mb-0">
                          <button
                            type="button"
                            onClick={() => setExpandedEntry(entry)}
                            className="text-left flex-1 text-base leading-relaxed whitespace-pre-line line-clamp-3 hover:text-accent transition-colors"
                          >
                            {cleanTILContent(entry.content || '') || 'No content available'}
                          </button>
                          <Link
                            to={`/editor?path=${encodeURIComponent(`obsidian/${entry.path}`)}`}
                            className="shrink-0 mt-1 text-muted-foreground/50 hover:text-accent transition-colors"
                            title="Edit this entry in the vault editor"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      ))
                    ) : key <= todayKey ? (
                      <Link
                        to={`/editor?path=${encodeURIComponent(`obsidian/Daily - TIL/${tilFilename(day)}`)}&create=1`}
                        className="inline-flex items-center gap-1.5 italic text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> add entry
                      </Link>
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

      <Dialog open={!!expandedEntry} onOpenChange={(open) => !open && setExpandedEntry(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm uppercase tracking-wide text-accent">
              {expandedEntry && formatFullDate(expandedEntry.date)}
            </DialogTitle>
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
