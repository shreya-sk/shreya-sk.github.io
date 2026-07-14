// /editor — live browser editor for the Obsidian vault.
// Left: reactive file tree · Center: CodeMirror 6 · Right: Git sync dashboard.

import { useEffect, useMemo, useState } from 'react';
import { Settings, PanelRight, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVault } from '@/vault/useVault';
import { readConflicts } from '@/vault/vaultFs';
import { ConflictEntry } from '@/vault/types';
import FileTree from '@/components/vault/FileTree';
import MarkdownEditor from '@/components/vault/MarkdownEditor';
import SyncPanel from '@/components/vault/SyncPanel';
import SettingsDialog from '@/components/vault/SettingsDialog';
import ConflictModal from '@/components/vault/ConflictModal';
import NewFileDialog from '@/components/vault/NewFileDialog';
import UnlockScreen from '@/components/vault/UnlockScreen';
import { LockBlob, fetchLockBlob } from '@/vault/crypto';
import { toast } from 'sonner';

export default function VaultEditor() {
  const vault = useVault();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lockBlob, setLockBlob] = useState<LockBlob | null | 'loading'>('loading');
  const [forceTokenEntry, setForceTokenEntry] = useState(false);
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileFolder, setNewFileFolder] = useState('');
  const [conflictLog, setConflictLog] = useState<ConflictEntry[]>([]);
  const [showTree, setShowTree] = useState(true);
  const [showSync, setShowSync] = useState(true);

  const paths = useMemo(
    () =>
      vault.meta
        ? Object.entries(vault.meta.files)
            .filter(([, m]) => !m.deleted)
            .map(([p]) => p)
        : [],
    [vault.meta]
  );

  const folders = useMemo(() => {
    const set = new Set<string>();
    for (const p of paths) {
      const parts = p.split('/').slice(0, -1);
      let acc = '';
      for (const part of parts) {
        acc = acc ? `${acc}/${part}` : part;
        set.add(acc);
      }
    }
    return [...set].sort();
  }, [paths]);

  useEffect(() => {
    readConflicts().then(setConflictLog);
  }, [vault.newConflicts, vault.syncState.lastSync]);

  // If no saved credentials, look for a password-locked blob shipped with the site
  useEffect(() => {
    if (vault.settings) return;
    fetchLockBlob().then(setLockBlob);
  }, [vault.settings]);

  const openWikilink = (target: string) => {
    const lower = target.toLowerCase();
    const hit =
      paths.find((p) => p.toLowerCase() === `${lower}.md`) ||
      paths.find((p) => p.toLowerCase().endsWith(`/${lower}.md`));
    if (hit) vault.openFile(hit).catch((e) => toast.error(e.message));
    else toast.info(`No note named “${target}” in the vault`);
  };

  if (!vault.settings) {
    if (lockBlob === 'loading') {
      return (
        <div className="min-h-[70vh] flex items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      );
    }
    if (lockBlob && !forceTokenEntry) {
      return (
        <UnlockScreen
          blob={lockBlob}
          onUnlocked={vault.setSettings}
          onUseToken={() => setForceTokenEntry(true)}
        />
      );
    }
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <SettingsDialog
          open
          dismissable={false}
          onOpenChange={() => undefined}
          initial={null}
          onSaved={vault.setSettings}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* toolbar */}
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setShowTree((v) => !v)} title="Toggle file tree">
            <FolderTree className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">
            {vault.settings.owner}/{vault.settings.repo}
            {vault.settings.basePath ? `/${vault.settings.basePath}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setSettingsOpen(true)} title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowSync((v) => !v)} title="Toggle sync panel">
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* three-pane workspace */}
      <div className="flex flex-1 min-h-0">
        {showTree && (
          <aside className="w-64 shrink-0 border-r bg-muted/20">
            <FileTree
              paths={paths}
              dirtyPaths={vault.dirtyPaths}
              activePath={vault.activeFile?.path}
              onOpen={(p) => vault.openFile(p).catch((e) => toast.error(e.message))}
              onNewFile={(folder) => {
                setNewFileFolder(folder);
                setNewFileOpen(true);
              }}
            />
          </aside>
        )}

        <main className="flex-1 min-w-0">
          {vault.activeFile ? (
            <MarkdownEditor
              path={vault.activeFile.path}
              content={vault.activeFile.content}
              onChange={(p, c) => vault.saveActive(p, c)}
              onWikilinkClick={openWikilink}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              {vault.syncState.status === 'fetching'
                ? 'Cloning vault into browser storage…'
                : 'Select a note from the tree, or create a new one.'}
            </div>
          )}
        </main>

        {showSync && (
          <aside className="w-72 shrink-0 border-l bg-muted/20">
            <SyncPanel
              syncState={vault.syncState}
              dirtyPaths={vault.dirtyPaths}
              conflictLog={conflictLog}
              onPull={() => vault.pull().catch((e) => toast.error(e.message))}
              onPush={(m) =>
                vault
                  .push(m)
                  .then(() => toast.success('Pushed to GitHub'))
                  .catch((e) => toast.error(e.message))
              }
            />
          </aside>
        )}
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        initial={vault.settings}
        onSaved={vault.setSettings}
      />
      <NewFileDialog
        open={newFileOpen}
        folder={newFileFolder}
        folders={folders}
        onOpenChange={setNewFileOpen}
        onCreate={(path) => vault.createFile(path, `# ${path.split('/').pop()?.replace(/\.md$/, '')}\n\n`)}
      />
      <ConflictModal conflicts={vault.newConflicts} onDismiss={vault.dismissConflicts} />
    </div>
  );
}
