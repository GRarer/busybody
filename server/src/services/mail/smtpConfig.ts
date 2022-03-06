import { Schemas } from '@nprindle/augustus';
import SMTPTransporter from 'nodemailer/lib/smtp-transport';
import { serverConfiguration } from '../../util/config.js';
import nodemailer from 'nodemailer';

const validateSMTPConfig = Schemas.recordOf({
  host: Schemas.aString,
  port: Schemas.aNumber,
  auth: Schemas.recordOf({
    user: Schemas.aString,
    pass: Schemas.aString
  })
}).validate;

export const smtpTransport: nodemailer.Transporter<SMTPTransporter.SentMessageInfo> = (() => {
  try {
    const config: unknown = JSON.parse(serverConfiguration.smtpConfig);
    if (!validateSMTPConfig(config)) {
      console.error('invalid smtp config object');
      console.error(config); // TODO remove before prod to not log credentials
      throw new Error('invalid smtp configuration');
    }
    return nodemailer.createTransport(config);
  } catch (e) {
    console.error('invalid smtp transport configuration');
    throw e;
  }
})();
