import type { StateStorage } from 'zustand/middleware';
import { debounce } from '@/lib/debounce';

/**
 * Storage adapters for the resume store.
 *
 * - `getSafeStorage` returns a real LocalStorage adapter in the browser and an
 *   in-memory one on the server (so SSR never touches `window`).
 * - `createDebouncedStorage` wraps any adapter so rapid edits collapse into a
 *   single write after a quiet period — the "automatic save with debounce".
 */

/** In-memory storage. Used on the server and in tests. */
export function createMemoryStorage(): StateStorage {
  const map = new Map<string, string>();
  return {
    getItem: (name) => (map.has(name) ? (map.get(name) as string) : null),
    setItem: (name, value) => {
      map.set(name, value);
    },
    removeItem: (name) => {
      map.delete(name);
    },
  };
}

/** LocalStorage in the browser, memory fallback everywhere else. */
export function getSafeStorage(): StateStorage {
  if (typeof window === 'undefined' || !('localStorage' in window)) {
    return createMemoryStorage();
  }
  return {
    getItem: (name) => window.localStorage.getItem(name),
    setItem: (name, value) => window.localStorage.setItem(name, value),
    removeItem: (name) => window.localStorage.removeItem(name),
  };
}

export interface DebouncedStorage extends StateStorage {
  /** Write any pending value immediately. */
  flush: () => void;
  /** Drop any pending write. */
  cancel: () => void;
}

/**
 * Wrap a storage adapter so `setItem` is debounced by `waitMs`. `getItem` stays
 * synchronous and reads through to the base adapter. `removeItem` cancels any
 * pending write and removes immediately.
 */
export function createDebouncedStorage(base: StateStorage, waitMs: number): DebouncedStorage {
  const write = debounce((name: string, value: string) => {
    void base.setItem(name, value);
  }, waitMs);

  return {
    getItem: (name) => base.getItem(name),
    setItem: (name, value) => {
      if (waitMs <= 0) {
        void base.setItem(name, value);
        return;
      }
      write(name, value);
    },
    removeItem: (name) => {
      write.cancel();
      void base.removeItem(name);
    },
    flush: () => write.flush(),
    cancel: () => write.cancel(),
  };
}
