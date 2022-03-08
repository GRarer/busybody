import { DomainOf } from '@nprindle/augustus';
import { ServerStatusResponse, testEmailEndpoint } from 'busybody-core';
import { serverConfiguration } from '../util/config.js';
import { dbQuery } from '../util/db.js';
import { UserException } from '../util/errors.js';
import { dontValidate } from '../util/typeGuards.js';
import { sendPlaintextEmail } from './mail/mail.js';

function requireTestingMode(): void {
  if (!serverConfiguration.testingCommandsEnabled) {
    throw new UserException(403, 'Testing commands are not enabled');
  }
}

export async function getServerStatus(): Promise<ServerStatusResponse> {
  requireTestingMode();
  const userCount = (await dbQuery('select 1 from users', [], dontValidate)).length;

  return {
    status: 'BusyBody server online',
    time: (new Date()).toString(),
    userCount
  };
}

export async function sendTestEmail(request: DomainOf<typeof testEmailEndpoint.requestSchema>): Promise<void> {
  requireTestingMode();
  await sendPlaintextEmail(request.to);
}


