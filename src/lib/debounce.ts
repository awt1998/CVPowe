export interface Debounced<A extends unknown[]> {
  (...args: A): void;
  /** Run any pending call immediately. */
  flush: () => void;
  /** Discard any pending call. */
  cancel: () => void;
}

/**
 * Trailing-edge debounce. The wrapped function runs `waitMs` after the last call.
 * `flush` forces a pending call to run now; `cancel` drops it. Used by the
 * persistence layer for autosave and unit-tested with fake timers.
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  waitMs: number,
): Debounced<A> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: A | null = null;

  const run = () => {
    if (pendingArgs) {
      const args = pendingArgs;
      pendingArgs = null;
      timer = null;
      fn(...args);
    }
  };

  const debounced = ((...args: A) => {
    pendingArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(run, waitMs);
  }) as Debounced<A>;

  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer);
      run();
    }
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    pendingArgs = null;
  };

  return debounced;
}
