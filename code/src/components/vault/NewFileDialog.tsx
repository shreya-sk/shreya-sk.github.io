// "New note" dialog - pick/confirm the folder, name the note.

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewFileDialogProps {
  open: boolean;
  folder: string; // preselected folder ('' = vault root)
  folders: string[];
  onOpenChange: (open: boolean) => void;
  onCreate: (path: string) => Promise<void>;
}

export default function NewFileDialog({ open, folder, folders, onOpenChange, onCreate }: NewFileDialogProps) {
  const [dir, setDir] = useState(folder);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDir(folder);
      setName('');
      setError(null);
    }
  }, [open, folder]);

  const submit = async () => {
    const clean = name.trim().replace(/\.md$/i, '');
    if (!clean) return;
    if (/[\\:*?"<>|]/.test(clean)) {
      setError('Name contains invalid characters.');
      return;
    }
    const path = `${dir ? dir.replace(/\/$/, '') + '/' : ''}${clean}.md`;
    try {
      await onCreate(path);
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New note</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="nf-dir">Folder</Label>
            <select
              id="nf-dir"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={dir}
              onChange={(e) => setDir(e.target.value)}
            >
              <option value="">(vault root)</option>
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nf-name">Note name</Label>
            <Input
              id="nf-name"
              placeholder="My new note"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button className="w-full" onClick={submit} disabled={!name.trim()}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
