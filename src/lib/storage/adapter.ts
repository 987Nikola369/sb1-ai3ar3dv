import type { UploadResult } from './types';

export interface StorageAdapter {
  upload: (bucket: string, path: string, file: File) => Promise<UploadResult>;
  getUrl: (bucket: string, path: string) => string;
  remove: (bucket: string, path: string) => Promise<void>;
}

export function createStorageAdapter(adapter: StorageAdapter): StorageAdapter {
  return adapter;
}