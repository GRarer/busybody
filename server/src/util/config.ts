import dotenv from 'dotenv';
import pg from 'pg';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

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
    throw new Error(`Fatal: environment variable ${key} must be an integer, was instead '${v}'`);
  }
  return v;
}

function getBoolEV(key: string, defaultValue?: boolean) {
  const v = process.env[key];
  if (v === undefined && defaultValue !== undefined) {
    return defaultValue;
  }
  if (v !== undefined) {
    const s = v.toLowerCase();
    if (s === 'true') {
      return true;
    } else if (s === 'false') {
      return false;
    }
  }
  throw new Error(`Fatal: environment variable ${key} must be 'true' or 'false', was instead '${v}'`);
}

export const serverConfiguration: {
  apiPort: number;
  postgresConfig: pg.PoolConfig;
  testingCommandsEnabled: boolean,
  emailTransport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
  emailFromField: string
} = {
  apiPort: getIntEV('BB_PORT'),
  testingCommandsEnabled: getBoolEV("BB_LOCAL_TEST_MODE", false),
  postgresConfig: {
    host: getStringEV('BB_DB_HOST'),
    port: getIntEV('BB_DB_PORT'),
    database: getStringEV('BB_DB_DATABASE'),
    user: getStringEV('BB_DB_USER'),
    password: getStringEV('BB_DB_PASSWORD')
  },
  emailTransport: getBoolEV('BB_MAIL_ETHEREAL', false)
    ? nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'cdexyaksc3skynmc@ethereal.email',
        pass: 'pWmHSPDAh8mgPZxJJc'
      }
    })
    : nodemailer.createTransport({
      service: getStringEV('BB_MAIL_LIVE_SERVICE'),
      auth: {
        user: getStringEV('BB_MAIL_LIVE_USERNAME'),
        pass: getStringEV('BB_MAIL_LIVE_PASSWORD')
      }
    }),
  emailFromField: getStringEV("BB_EMAIL_FROM")
};
