import { Schema } from '@nprindle/augustus';
import pg from 'pg';
import { serverConfiguration } from './config.js';
import { UserException } from './errors.js';

pg.types.setTypeParser(pg.types.builtins.INT8, (x: string) => parseInt(x, 10));

const pool = new pg.Pool(serverConfiguration.postgresConfig);

// runs a sequence of queries on a database client, validating the response of each query result
// automatically rolls back if an error occurs
export async function dbTransaction<Result>(
  action: (
    queryFunction: <T extends unknown, R extends unknown>(
      queryString: string,
      params: unknown[],
      schema: Schema<T,R>
    ) => Promise<T[]>
  ) => Promise<Result>
): Promise<Result> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    // caller provides an action function that consumes a type-safe query function
    const result = await action(async (queryString, params, schema) => {
      const rows: unknown[] = (await client.query(queryString, params)).rows;
      if (rows.every(schema.validate)) {
        return rows.map(r => schema.decode(r));
      } else {
        console.error('unexpected database response:');
        console.log(rows);
        throw new UserException(500);
      }
    });
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// performs a single query and validates the return value of the rows
// for multiple dependent queries, use dbTransaction instead
export async function dbQuery<T,R>(
  queryString: string,
  params: unknown[],
  schema: Schema<T,R>
): Promise<T[]> {
  const rows: unknown[] = (await pool.query(queryString, params)).rows;
  if (rows.every(schema.validate)) {
    return rows.map(r => schema.decode(r));
  } else {
    console.error('unexpected database response:');
    console.log(rows);
    throw new UserException(500);
  }
}

// should be called only when the server exits
export async function disconnectDatabase(): Promise<void> {
  return await pool.end();
}
