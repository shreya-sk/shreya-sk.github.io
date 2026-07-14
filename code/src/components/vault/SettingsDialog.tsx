// PAT + repository settings. The token is stored strictly in localStorage
// and only ever sent to api.github.com.

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VaultSettings } from '@/vault/types';
import { DEFAULT_SETTINGS, saveSettings } from '@/vault/settings';
import { GitHubGitClient } from '@/vault/githubClient';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: VaultSettings | null;
  onSaved: (s: VaultSettings) => void;
  dismissable?: boolean;
}

export default function SettingsDialog({ open, onOpenChange, initial, onSaved, dismissable = true }: SettingsDialogProps) {
  const [form, setForm] = useState<VaultSettings>(initial ?? DEFAULT_SETTINGS);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof VaultSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(null);
    setChecking(true);
    try {
      await new GitHubGitClient(form).checkAccess();
      saveSettings(form);
      onSaved(form);
      onOpenChange(false);
    } catch (err) {
      setError(`Could not access ${form.owner}/${form.repo}: ${(err as Error).message}`);
    } finally {
      setChecking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => dismissable && onOpenChange(o)}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => !dismissable && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Connect your vault</DialogTitle>
          <DialogDescription>
            Your Personal Access Token is stored only in this browser's localStorage and sent
            only to api.github.com. Use a fine-grained PAT scoped to the vault repo with
            Contents: Read &amp; Write.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="pat">GitHub Personal Access Token</Label>
            <Input id="pat" type="password" placeholder="github_pat_…" value={form.token} onChange={set('token')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="owner">Owner</Label>
              <Input id="owner" value={form.owner} onChange={set('owner')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="repo">Repository</Label>
              <Input id="repo" value={form.repo} onChange={set('repo')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" value={form.branch} onChange={set('branch')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="base">Base path (optional)</Label>
              <Input id="base" placeholder="e.g. obsidian" value={form.basePath} onChange={set('basePath')} />
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button className="w-full" onClick={submit} disabled={checking || !form.token || !form.owner || !form.repo}>
            {checking ? 'Verifying access…' : 'Connect & clone'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
