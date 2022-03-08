import { Schemas } from '@nprindle/augustus';
import { currentTimeSeconds, ExportedPersonalData, passwordRequirementProblem, RegistrationRequest, SelfInfoResponse,
  usernameRequirementProblem } from 'busybody-core';
import { dbQuery, dbTransaction } from '../util/db.js';
import { UserException } from '../util/errors.js';
import bcrypt from 'bcrypt';
import { generateRandomToken, lookupSessionUser } from './authentication.js';
import { dontValidate } from '../util/typeGuards.js';
import { v4 as uuidV4 } from 'uuid';
import { getOwnTodoList, getWatchedTasks } from './tasks.js';
import { string } from 'pg-format';
import { randomCode } from '../util/random.js';
import { sendEmailChangeVerificationEmail } from './mail/mail.js';

export async function getSelfInfo(token: string): Promise<SelfInfoResponse> {
  const results = await dbQuery(
    `select user_uuid, username, full_name, nickname, email, use_gravatar
    from sessions join users using (user_uuid) where token = $1;`,
    [token],
    Schemas.recordOf({
      user_uuid: Schemas.aString,
      username: Schemas.aString,
      full_name: Schemas.aString,
      nickname: Schemas.aString,
      email: Schemas.aString,
      use_gravatar: Schemas.aBoolean
    })
  );
  if (results.length === 0) {
    throw new UserException(401, 'Invalid session token');
  }
  const result = results[0];
  return {
    uuid: result.user_uuid,
    username: result.username,
    fullName: result.full_name,
    nickname: result.nickname,
    email: result.email,
    useGravatar: result.use_gravatar
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

export async function updateAccountInfo(request: {
  username: string; fullName: string; nickname: string;
}, token: string): Promise<void> {
  const userId = await lookupSessionUser(token);
  try {
    await dbQuery('update users set username = $1, full_name = $2, nickname = $3 where user_uuid = $4',
      [request.username, request.fullName, request.nickname, userId], dontValidate
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      const message = err.message;
      if (message.includes('duplicate key value violates unique constraint')) {
        if (message.includes('username')) {
          throw new UserException(409, 'That username is already taken');
        } else if (message.includes('email')) {
          // TODO prevent attackers from using this to get identify who has an account
          throw new UserException(409, 'There is already an account with that email address');
        }
      }
    }
    throw err;
  }
}

export async function sendEmailVerificationCode(newAddress: string): Promise<void> {

  // generate a random verification code
  // unlike password-reset codes, this doesn't need to use a cryptographic-quality random number source
  const code = randomCode(6, "insecure");

  await dbQuery(
    `insert into email_verification_codes ("email", "code", "expiration") values ($1, $2, $3);`,
    [newAddress, code, currentTimeSeconds() + 3600], dontValidate
  );

  sendEmailChangeVerificationEmail(newAddress, code);
}

export async function updateEmailAddress(newAddress: string, verificationCode: string, sessionToken: string): Promise<void> {
  const userId = await lookupSessionUser(sessionToken);
  const matchingCodes = await dbQuery(
    `select 1 from email_verification_codes where email = $1 and code = $2`, [newAddress, verificationCode], dontValidate
  );
  if (matchingCodes.length === 0) {
    throw new UserException(403, "Incorrect or expired validation code");
  }

  await dbQuery('update users set email = $1 where user_uuid = $2',
    [newAddress, userId], dontValidate
  );
}

export async function updatePassword(newPassword: string, sessionToken: string): Promise<void> {
  const userId = await lookupSessionUser(sessionToken);
  const hash = await bcrypt.hash(newPassword, 10);
  await dbQuery('update users set password_hash = $1 where user_uuid = $2',
    [hash, userId], dontValidate
  );
}

export async function updateGravatarSetting(useGravatar: boolean, sessionToken: string): Promise<void> {
  const userId = await lookupSessionUser(sessionToken);
  await dbQuery('update users set use_gravatar = $1 where user_uuid = $2',
    [useGravatar, userId], dontValidate
  );
}

export async function exportAccountData(token: string): Promise<ExportedPersonalData> {
  const userId = await lookupSessionUser(token);

  const userIdentityRows = await dbQuery(
    'select username, full_name, nickname, email from users where user_uuid = $1;', [userId],
    Schemas.recordOf({
      username: Schemas.aString,
      full_name: Schemas.aString,
      nickname: Schemas.aString,
      email: Schemas.aString
    })
  );

  if (userIdentityRows.length === 0) {
    throw new UserException(500, 'session appears valid but user account info could not be found');
  }
  const userIdentity = userIdentityRows[0];

  const todoListResponse = await getOwnTodoList(token);
  const watchedTasksResponse = await getWatchedTasks(token);

  return {
    description: 'data exported from Busybody app',
    dateExported: `${new Date(Date.now())}`,
    personalInfo: {
      username: userIdentity.username,
      fullName: userIdentity.full_name,
      nickname: userIdentity.nickname,
      email: userIdentity.email
    },
    todoListTasks: todoListResponse.tasks,
    friends: todoListResponse.friends,
    watchedTasks: watchedTasksResponse,
  };
}

export async function deleteAccount(token: string): Promise<void> {
  const userId = await lookupSessionUser(token);
  await dbQuery('delete from users where user_uuid = $1;', [userId], dontValidate);
}
