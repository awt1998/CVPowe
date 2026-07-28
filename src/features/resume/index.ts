/**
 * Public API of the resume feature — the reusable data engine every future page
 * builds on. Import from `@/features/resume`, not from internal files.
 */
export * from './constants';
export * from './types';
export * from './schema';
export * from './factory';
export * from './serialization';
export * from './selectors';
export * as resumeOperations from './operations';
export {
  createDebouncedStorage,
  getSafeStorage,
  createMemoryStorage,
  type DebouncedStorage,
} from './persistence';
export { runMigrations } from './migrations';
export {
  createResumeStore,
  useResumeStore,
  type ResumeStore,
  type ResumeStoreActions,
  type ResumeStoreOptions,
} from './store';
