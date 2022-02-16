import { Schemas } from '@nprindle/augustus';
import { SelfInfoResponse } from 'busybody-core';
import { dbTransaction } from '../util/db.js';
import { UserException } from '../util/errors.js';

export async function getSelfInfo(token: string): Promise<SelfInfoResponse> {
  const result = await dbTransaction(async query => {
    const results = await query(
      'select username, full_name, nickname, email from sessions join users using (user_uuid) where token = $1;',
      [token],
      Schemas.recordOf({
        username: Schemas.aString,
        full_name: Schemas.aString,
        nickname: Schemas.aString,
        email: Schemas.aString
      }).validate
    );
    if (results.length === 0) {
      throw new UserException(401, 'Invalid session token');
    }
    return results[0];

  });
  return {
    username: result.username,
    fullName: result.full_name,
    nickname: result.nickname,
    email: result.email
  };
}
