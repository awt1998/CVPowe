import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDebouncedStorage, createMemoryStorage } from '../persistence';

describe('createDebouncedStorage', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('collapses rapid writes into a single write after the delay', () => {
    const base = createMemoryStorage();
    const spy = vi.spyOn(base, 'setItem');
    const storage = createDebouncedStorage(base, 500);

    storage.setItem('k', '1');
    storage.setItem('k', '2');
    storage.setItem('k', '3');
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('k', '3');
    expect(base.getItem('k')).toBe('3');
  });

  it('flush writes any pending value immediately', () => {
    const base = createMemoryStorage();
    const storage = createDebouncedStorage(base, 500);
    storage.setItem('k', 'v');
    storage.flush();
    expect(base.getItem('k')).toBe('v');
  });

  it('writes synchronously when the delay is zero', () => {
    const base = createMemoryStorage();
    const storage = createDebouncedStorage(base, 0);
    storage.setItem('k', 'v');
    expect(base.getItem('k')).toBe('v');
  });

  it('removeItem cancels a pending write', () => {
    const base = createMemoryStorage();
    const storage = createDebouncedStorage(base, 500);
    storage.setItem('k', 'v');
    storage.removeItem('k');
    vi.advanceTimersByTime(500);
    expect(base.getItem('k')).toBeNull();
  });
});
