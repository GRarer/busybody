// common type guards, useful for validating database query responses

export function isEmpty(xs: unknown[]): xs is never[] {
  return xs.length === 0;
}

export function isSingle<T>(xs: unknown[], guard: (x: unknown) => x is T): xs is [unknown] {
  return xs.length === 1 && guard(xs[0]);
}

export function isArrayOf<T>(xs: unknown[], guard: (x: unknown) => x is T): xs is T[] {
  return xs.every(guard);
}

// unlike Array.isArray, does not cast xs to Any
export function isArray(xs: unknown[]): xs is unknown[] {
  return Array.isArray(xs);
}
