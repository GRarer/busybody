import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config(); // if .env file is present, it will be used to populate environment variables


function getStringEV(key: string): string {
  const v = process.env[key];
  if (v === undefined) {
    throw new Error(`Fatal: missing required environment variable: ${key}`);
  }
  return v;
}

function getIntEV(key: string): number {
  const v = Number.parseInt(getStringEV(key));
  if (Number.isNaN(v)) {
    throw new Error(`Fatal: environment variable ${key} must be an integer`);
  }
  return v;
}

export const serverConfiguration: {
  apiPort: number;
  postgresConfig: pg.PoolConfig;
} = {
  apiPort: getIntEV('BB_PORT'),
  postgresConfig: {
    host: getStringEV('BB_DB_HOST'),
    port: getIntEV('BB_DB_PORT'),
    database: getStringEV('BB_DB_DATABASE'),
    user: getStringEV('BB_DB_USER'),
    password: getStringEV('BB_DB_PASSWORD')
  }
};
