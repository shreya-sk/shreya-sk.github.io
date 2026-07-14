// UI modal notification fired when the merge algorithm auto-resolves
// conflicts with the 'ours' (keep browser buffer) strategy.

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ConflictEntry } from '@/vault/types';

interface ConflictModalProps {
  conflicts: ConflictEntry[];
  onDismiss: () => void;
}

export default function ConflictModal({ conflicts, onDismiss }: ConflictModalProps) {
  return (
    <AlertDialog open={conflicts.length > 0}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Merge conflict auto-resolved</AlertDialogTitle>
          <AlertDialogDescription>
            These notes changed on GitHub while you had unsaved edits. Your browser version
            was kept (<code>ours</code> strategy). A warning callout was added inline and the
            event was recorded in the conflict log. Your next push will overwrite the remote
            change.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ul className="max-h-40 overflow-y-auto space-y-1">
          {conflicts.map((c) => (
            <li key={c.path} className="text-sm font-mono bg-destructive/10 rounded px-2 py-1 truncate">
              {c.path}
            </li>
          ))}
        </ul>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onDismiss}>Understood</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
