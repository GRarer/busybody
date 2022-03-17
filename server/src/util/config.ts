
import pg from 'pg';
import { getIntEV, getBoolEV, getStringEV, getOptionalStringEV } from './evParsing.js';


export const serverConfiguration: {
  apiPort: number;
  postgresConfig: pg.PoolConfig;
  testingCommandsEnabled: boolean;
  smtpConfig: string;
  emailFromField: string;
  appUrl: string;
  secondsBetweenChecks: number;
  wakeUpEmailDestination: string | undefined;
} = {
  apiPort: getIntEV('BB_PORT'),
  testingCommandsEnabled: getBoolEV('BB_LOCAL_TEST_MODE', false),
  postgresConfig: {
    host: getStringEV('BB_DB_HOST'),
    port: getIntEV('BB_DB_PORT'),
    database: getStringEV('BB_DB_DATABASE'),
    user: getStringEV('BB_DB_USER'),
    password: getStringEV('BB_DB_PASSWORD'),
    ssl: getBoolEV('BB_DB_SSL_ENABLED')
  },
  smtpConfig: getStringEV('BB_MAIL_SMTP_CONFIG'),
  emailFromField: getStringEV('BB_EMAIL_FROM'),
  appUrl: getStringEV('BB_APP_URL'),
  secondsBetweenChecks: getIntEV('BB_LOOP_SECONDS'),
  wakeUpEmailDestination: getOptionalStringEV('BB_WAKEUP_EMAIL_ADDRESS')
};
