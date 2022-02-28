// common type guards, useful for validating database query responses
import { Schema, Schemas } from '@nprindle/augustus';

// no-op schema for database queries where the result will not be used
export const dontValidate: Schema<unknown, unknown> = {
  encode: x => x,
  decode: x => x,
  validate: (x): x is unknown => true
}

// useful for postgres array columns, which can be null if the array is empty
export function optionallyNullArrayOfSchema<D, R>(s: Schema<D,R>): Schema<D[], R[] | null> {
  const inner = Schemas.arrayOf(s);
  return {
    encode: val => inner.encode(val),
    validate: (data): data is null | R[] => (data === null) || inner.validate(data),
    decode: data => data === null ? [] : inner.decode(data)
  }
}


// allows compile-time totality checking to guarantee this function is never called
export function absurd(x: never): never {
  throw new Error('This code should be unreachable');
}
