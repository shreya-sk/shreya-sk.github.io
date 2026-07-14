// Git Sync Status dashboard: live status tracker, uncommitted edits,
// commit message input, pull / commit-&-push actions, conflict log.

import { useState } from 'react';
import {
  CloudDownload,
  CloudUpload,
  GitCommitHorizontal,
  Loader2,
  CircleCheck,
  CircleAlert,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SyncState, ConflictEntry } from '@/vault/types';
import { cn } from '@/lib/utils';

const STATUS_LABEL: Record<SyncState['status'], string> = {
  idle: 'Idle',
  fetching: 'Fetching',
  pulling: 'Pulling',
  merging: 'Merging',
  pushing: 'Pushing',
  error: 'Error',
};

interface SyncPanelProps {
  syncState: SyncState;
  dirtyPaths: string[];
  conflictLog: ConflictEntry[];
  onPull: () => void;
  onPush: (message: string) => void;
}

export default function SyncPanel({ syncState, dirtyPaths, conflictLog, onPull, onPush }: SyncPanelProps) {
  const [message, setMessage] = useState('');
  const busy = syncState.status !== 'idle' && syncState.status !== 'error';

  return (
    <div className="h-full overflow-y-auto p-4 space-y-5 text-sm">
      {/* status tracker */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Git Sync Status</h3>
        <div className="flex items-center gap-2">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : syncState.status === 'error' ? (
            <CircleAlert className="h-4 w-4 text-destructive" />
          ) : (
            <CircleCheck className="h-4 w-4 text-green-600" />
          )}
          <Badge variant={syncState.status === 'error' ? 'destructive' : 'secondary'}>
            {STATUS_LABEL[syncState.status]}
          </Badge>
        </div>
        {(syncState.detail || syncState.error) && (
          <p className={cn('mt-1.5 text-xs', syncState.error ? 'text-destructive' : 'text-muted-foreground')}>
            {syncState.error ?? syncState.detail}
          </p>
        )}
        {syncState.lastSync && (
          <p className="mt-1 text-xs text-muted-foreground">
            Last sync: {new Date(syncState.lastSync).toLocaleTimeString()} · auto-pull every 10 min
          </p>
        )}
      </div>

      {/* uncommitted edits */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
          <GitCommitHorizontal className="h-3.5 w-3.5" />
          Uncommitted edits ({dirtyPaths.length})
        </h3>
        {dirtyPaths.length ? (
          <ul className="space-y-1">
            {dirtyPaths.map((p) => (
              <li key={p} className="truncate text-xs font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded px-2 py-1">
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">Working tree clean.</p>
        )}
      </div>

      {/* commit & push */}
      <div className="space-y-2">
        <Textarea
          placeholder="Commit message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="text-sm"
        />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" disabled={busy} onClick={onPull}>
            <CloudDownload className="h-3.5 w-3.5 mr-1.5" /> Pull
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={busy || !dirtyPaths.length}
            onClick={() => {
              onPush(message.trim());
              setMessage('');
            }}
          >
            <CloudUpload className="h-3.5 w-3.5 mr-1.5" /> Commit & Push
          </Button>
        </div>
      </div>

      {/* conflict log */}
      {conflictLog.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Conflict log
          </h3>
          <ul className="space-y-1.5">
            {[...conflictLog].reverse().slice(0, 20).map((c, i) => (
              <li key={i} className="text-xs bg-destructive/10 rounded px-2 py-1.5">
                <span className="font-mono block truncate">{c.path}</span>
                <span className="text-muted-foreground">
                  {new Date(c.at).toLocaleString()} — kept your version
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
