// common type guards, useful for validating database query responses
import { Schema } from '@nprindle/augustus';

export function isEmpty(xs: unknown[]): xs is never[] {
  return xs.length === 0;
}

export function isSingle<T>(xs: unknown[], guard: (x: unknown) => x is T): xs is [unknown] {
  return xs.length === 1 && guard(xs[0]);
}

export function isArrayOf<T>(xs: unknown[], guard: (x: unknown) => x is T): xs is T[] {
  return xs.every(guard);
}

export function elementsMatchSchema<S, D=S>(schema: Schema<D, S>): (xs: unknown[]) => xs is S[] {
  return (xs: unknown[]): xs is S[] => isArrayOf(xs, schema.validate);
}

// unlike Array.isArray, does not cast xs to Any
export function isArray(xs: unknown[]): xs is unknown[] {
  return Array.isArray(xs);
}
