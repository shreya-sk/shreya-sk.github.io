// Password unlock: decrypts the shipped vault.lock.json into settings.

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LockBlob, decryptSettings } from '@/vault/crypto';
import { saveSettings } from '@/vault/settings';
import { VaultSettings } from '@/vault/types';

interface UnlockScreenProps {
  blob: LockBlob;
  onUnlocked: (settings: VaultSettings) => void;
  onUseToken: () => void; // fallback to manual token entry
}

export default function UnlockScreen({ blob, onUnlocked, onUseToken }: UnlockScreenProps) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = async () => {
    if (!password) return;
    setBusy(true);
    setError(null);
    try {
      const settings = await decryptSettings(blob, password);
      saveSettings(settings);
      onUnlocked(settings);
    } catch {
      setError('Wrong password — try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xs space-y-4 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Unlock your vault</h1>
          <p className="text-sm text-muted-foreground">
            Enter your password — you'll only do this once per device.
          </p>
        </div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && unlock()}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button className="w-full" onClick={unlock} disabled={busy || !password}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock'}
        </Button>
        <button className="text-xs text-muted-foreground underline" onClick={onUseToken}>
          use a token instead
        </button>
      </div>
    </div>
  );
}
