import dotenv from 'dotenv';
import pg from 'pg';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getIntEV, getBoolEV, getStringEV } from './evParsing.js';

dotenv.config(); // if .env file is present, it will be used to populate environment variables


export const serverConfiguration: {
  apiPort: number;
  postgresConfig: pg.PoolConfig;
  testingCommandsEnabled: boolean;
  emailTransport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  emailFromField: string;
  appUrl: string;
  secondsBetweenChecks: number;
} = {
  apiPort: getIntEV('BB_PORT'),
  testingCommandsEnabled: getBoolEV('BB_LOCAL_TEST_MODE', false),
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
  emailFromField: getStringEV('BB_EMAIL_FROM'),
  appUrl: getStringEV('BB_APP_URL'),
  secondsBetweenChecks: getIntEV('BB_LOOP_SECONDS')
};
