import { ServerStatusResponse } from 'busybody-core';
import { dbTransaction } from '../util/db.js';
import { isArray } from '../util/typeGuards.js';

export async function getServerStatus(): Promise<ServerStatusResponse> {

  const userCount = await dbTransaction(async query => {
    return (await query('select 1 from users', [], isArray)).length;
  });

  return {
    status: 'BusyBody server online',
    time: (new Date()).toString(),
    userCount
  };
}
