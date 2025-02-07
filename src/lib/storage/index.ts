import { createStorageAdapter } from './adapter';
import { LocalStorageAdapter } from './local';

// Create an adapter that can be switched between local and Supabase
export const storage = createStorageAdapter(new LocalStorageAdapter());

// Export types
export type { StorageAdapter } from './adapter';
export type { UploadResult } from './types';