import { Schemas } from '@nprindle/augustus';
import { passwordRequirementProblem, RegistrationRequest, SelfInfoResponse,
  usernameRequirementProblem } from 'busybody-core';
import { dbQuery, dbTransaction } from '../util/db.js';
import { UserException } from '../util/errors.js';
import bcrypt from 'bcrypt';
import { generateRandomToken } from './authentication.js';
import { dontValidate } from '../util/typeGuards.js';
import { v4 as uuidV4 } from 'uuid';

export async function getSelfInfo(token: string): Promise<SelfInfoResponse> {
  const results = await dbQuery(
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
  const result = results[0];
  return {
    username: result.username,
    fullName: result.full_name,
    nickname: result.nickname,
    email: result.email
  };
}

export async function register(request: RegistrationRequest): Promise<string> {
  // validate username and password formats
  const usernameOrPasswordProblem
    = usernameRequirementProblem(request.username) ?? passwordRequirementProblem(request.password);
  if (usernameOrPasswordProblem) {
    throw new UserException(400, usernameOrPasswordProblem);
  }

  const userId = uuidV4(); // generate a random permanent Universally Unique Identifier as the primary key of this user
  const hash = await bcrypt.hash(request.password, 10); // hashing passwords is asynchronous because it is slow
  const token = generateRandomToken();

  try {
    await dbTransaction(async query => {
      await query(
        `insert into users ("user_uuid", "username", "password_hash", "full_name", "nickname", "email")
        values ($1, $2, $3, $4, $5, $6);`,
        [userId, request.username, hash, request.fullName, request.nickname, request.email], dontValidate
      );
      await query('insert into sessions ("token", "user_uuid") values ($1, $2);', [token, userId], dontValidate);
    });
    return token;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const message = err.message;
      if (message.includes('duplicate key value violates unique constraint')) {
        if (message.includes('username')) {
          throw new UserException(409, 'That username is already taken');
        } else if (message.includes('email')) {
          throw new UserException(409, 'There is already an account with that email address');
        }
      }
    }
    console.error('failed to create account');
    console.log(err);
    throw err;
  }
}
