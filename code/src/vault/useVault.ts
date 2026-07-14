// React binding for the VaultSyncEngine.

import { useCallback, useEffect, useRef, useState } from 'react';
import { VaultSyncEngine } from './syncEngine';
import { loadSettings } from './settings';
import { VaultSettings, VaultMeta, SyncState, ConflictEntry } from './types';

export interface ActiveFile {
  path: string;
  content: string;
}

export function useVault() {
  const [settings, setSettings] = useState<VaultSettings | null>(() => loadSettings());
  const [meta, setMeta] = useState<VaultMeta | null>(null);
  const [syncState, setSyncState] = useState<SyncState>({ status: 'idle' });
  const [activeFile, setActiveFile] = useState<ActiveFile | null>(null);
  const [newConflicts, setNewConflicts] = useState<ConflictEntry[]>([]);
  const engineRef = useRef<VaultSyncEngine | null>(null);

  // (Re)create engine when settings change
  useEffect(() => {
    if (!settings) return;
    const engine = new VaultSyncEngine(settings);
    engineRef.current = engine;
    const offState = engine.onState(setSyncState);
    const offTree = engine.onTree((m) => setMeta({ ...m, files: { ...m.files } }));
    const offConflict = engine.onConflicts((c) => setNewConflicts(c));
    engine.init().then(() => engine.startAutoSync()).catch(() => undefined);
    return () => {
      offState();
      offTree();
      offConflict();
      engine.stopAutoSync();
      engineRef.current = null;
    };
  }, [settings]);

  const openFile = useCallback(async (path: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    const content = await engine.openFile(path);
    setActiveFile({ path, content });
  }, []);

  const saveActive = useCallback(async (path: string, content: string) => {
    setActiveFile((prev) => (prev && prev.path === path ? { ...prev, content } : prev));
    await engineRef.current?.saveFile(path, content);
  }, []);

  const createFile = useCallback(
    async (path: string, content = '') => {
      await engineRef.current?.createFile(path, content);
      setActiveFile({ path, content });
    },
    []
  );

  const deleteFile = useCallback(async (path: string) => {
    await engineRef.current?.deleteFile(path);
    setActiveFile((prev) => (prev?.path === path ? null : prev));
  }, []);

  const pull = useCallback(async () => {
    const res = await engineRef.current?.pull();
    // reload active buffer if it changed remotely
    if (res && activeFile && res.changed.includes(activeFile.path)) {
      const content = await engineRef.current!.openFile(activeFile.path);
      setActiveFile({ path: activeFile.path, content });
    }
    return res;
  }, [activeFile]);

  const push = useCallback(async (message: string) => {
    await engineRef.current?.push(message);
  }, []);

  const dismissConflicts = useCallback(async () => {
    // reload active file so the inline conflict stamp becomes visible
    if (activeFile && newConflicts.some((c) => c.path === activeFile.path)) {
      const content = await engineRef.current!.openFile(activeFile.path);
      setActiveFile({ path: activeFile.path, content });
    }
    setNewConflicts([]);
  }, [activeFile, newConflicts]);

  const dirtyPaths = meta
    ? Object.entries(meta.files)
        .filter(([, m]) => m.dirty)
        .map(([p]) => p)
    : [];

  return {
    settings,
    setSettings,
    meta,
    syncState,
    activeFile,
    dirtyPaths,
    newConflicts,
    openFile,
    saveActive,
    createFile,
    deleteFile,
    pull,
    push,
    dismissConflicts,
  };
}
