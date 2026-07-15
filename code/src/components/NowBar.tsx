// Floating "now" bar - the live half of the homepage.
// Sticky floating card on desktop, plain section on mobile.
// Everything here updates automatically on each vault sync.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTILEntries } from '@/hooks/useTILEntries';
import { useGists } from '@/hooks/useGists';
import { useGitHubPosts } from '@/hooks/useGitHubPosts';
import { fetchRecentPosts, getLastSynced } from '@/services/localMarkdownService';
import { getWeekStart, getWeekDays, formatDateKey } from '@/components/WeekCalendar';

function timeAgo(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const NowBar = () => {
  const { data: tilEntries = [] } = useTILEntries();
  const { data: gists = [] } = useGists();
  const { data: posts = [] } = useGitHubPosts();
  const { data: recent = [] } = useQuery({
    queryKey: ['recent-posts-rail'],
    queryFn: () => fetchRecentPosts(3),
    staleTime: 5 * 60 * 1000,
  });

  const week = useMemo(() => {
    const days = getWeekDays(getWeekStart(new Date()));
    const counts: Record<string, number> = {};
    tilEntries.forEach((e) => e.date && (counts[e.date] = (counts[e.date] || 0) + 1));
    return days.map((d) => ({ key: formatDateKey(d), count: counts[formatDateKey(d)] || 0 }));
  }, [tilEntries]);

  const weekCount = week.reduce((s, d) => s + d.count, 0);
  const latestTIL = useMemo(
    () => [...tilEntries].sort((a, b) => (b.date > a.date ? 1 : -1))[0],
    [tilEntries]
  );
  const synced = getLastSynced();

  return (
    <aside className="lg:sticky lg:top-24 self-start border-2 border-foreground/90 bg-background p-5 space-y-5">
      <div className="font-mono text-[11px] uppercase tracking-widest text-accent">now</div>

      {/* This week's TIL activity */}
      <Link to="/til" className="block group">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            this week
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {weekCount} {weekCount === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <div className="flex gap-1.5 mb-2.5">
          {week.map((d) => (
            <span
              key={d.key}
              className={`h-2.5 flex-1 ${d.count > 0 ? 'bg-accent' : 'bg-muted'}`}
            />
          ))}
        </div>
        {latestTIL && (
          <p className="text-sm leading-snug text-foreground/80 line-clamp-2 group-hover:text-accent transition-colors">
            {latestTIL.content
              ?.replace(/^---[\s\S]*?---\s*/, '')
              .replace(/[#>*`]/g, '')
              .trim()
              .slice(0, 120)}
          </p>
        )}
      </Link>

      <div className="h-px bg-foreground/20" />

      {/* Recently touched notes */}
      <div>
        <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground mb-2.5">
          recently touched
        </div>
        <ul className="space-y-2">
          {recent.map((p) => (
            <li key={p.id}>
              <Link
                to={`/blog?note=${encodeURIComponent(p.path.replace(/\.md$/i, ''))}`}
                className="group flex items-baseline gap-2 text-sm leading-snug hover:text-accent transition-colors"
              >
                <span className="text-accent shrink-0">·</span>
                <span className="truncate">{p.title}</span>
                <ArrowRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          ))}
          {!recent.length && (
            <li className="text-sm text-muted-foreground font-mono">nothing yet</li>
          )}
        </ul>
      </div>

      <div className="h-px bg-foreground/20" />

      {/* Counts + freshness */}
      <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground space-y-1.5">
        <div>
          <Link to="/blog" className="hover:text-accent transition-colors">{posts.length} notes</Link>
          {' · '}
          <Link to="/gists" className="hover:text-accent transition-colors">{gists.length} gists</Link>
          {' · '}
          <Link to="/til" className="hover:text-accent transition-colors">{tilEntries.length} learnings</Link>
        </div>
        {synced && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            synced {timeAgo(synced)}
          </div>
        )}
      </div>
    </aside>
  );
};

export default NowBar;
