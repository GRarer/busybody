import pg from 'pg';
import { serverConfiguration } from './config.js';

const pool = new pg.Pool(serverConfiguration.postgresConfig);

// runs a sequence of queries on a database client, validating the response of each query result
// automatically rolls back if an error occurs
export async function dbTransaction<Result>(
  action: (
    queryFunction: <T extends unknown>(
      queryString: string,
      params: unknown[],
      validation: (xs: unknown[]) => xs is T[]
    ) => Promise<T[]>
  ) => Promise<Result>
): Promise<Result> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    // caller provides an action function that consumes a type-safe query function
    const result = await action(async (queryString, params, validation) => {
      const rows: unknown[] = (await pool.query(queryString, params)).rows;
      if (validation(rows)) {
        return rows;
      } else {
        // TODO custom error type
        console.error('unexpected response:');
        console.log(rows);
        throw new Error('unexpected database query response');
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



// TODO make this happen when server closes
// should be called only when the server exits
export async function disconnectDatabase(): Promise<void> {
  return await pool.end();
}
