// common type guards, useful for validating database query responses
import { Schema } from '@nprindle/augustus';

export function matchesSchema<S, D=S>(schema: Schema<D, S>): (x: unknown) => x is S {
  return (x): x is S => schema.validate(x);
}

export function dontValidate(x: unknown): x is unknown {
  return true;
}

// allows compile-time totality checking to guarantee this function is never called
export function absurd(x: never): never {
  throw new Error('This code should be unreachable');
}
