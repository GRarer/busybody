import { ServerStatusResponse } from 'busybody-core';
import { dbQuery } from '../util/db.js';
import { dontValidate } from '../util/typeGuards.js';

export async function getServerStatus(): Promise<ServerStatusResponse> {

  const userCount = (await dbQuery('select 1 from users', [], dontValidate)).length;

  return {
    status: 'BusyBody server online',
    time: (new Date()).toString(),
    userCount
  };
}
