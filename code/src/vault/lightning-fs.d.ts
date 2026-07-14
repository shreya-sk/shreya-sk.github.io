declare module '@isomorphic-git/lightning-fs' {
  export interface FSPromises {
    readFile(path: string, opts?: { encoding?: 'utf8' } | 'utf8'): Promise<string | Uint8Array>;
    writeFile(path: string, data: string | Uint8Array, opts?: { encoding?: 'utf8' } | 'utf8'): Promise<void>;
    unlink(path: string): Promise<void>;
    readdir(path: string): Promise<string[]>;
    mkdir(path: string): Promise<void>;
    rmdir(path: string): Promise<void>;
    stat(path: string): Promise<{ type: 'file' | 'dir'; size: number }>;
  }
  export default class LightningFS {
    constructor(name: string, opts?: { wipe?: boolean });
    promises: FSPromises;
  }
}
