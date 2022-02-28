import LRUCache from 'lru-cache';
import { dbQuery, dbTransaction } from '../util/db.js';
import { Schemas } from '@nprindle/augustus';
import { UserException } from '../util/errors.js';
import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { LoginRequest } from 'busybody-core';
import { dontValidate } from '../util/typeGuards.js';

// maps recently-used session tokens to user uuids
// extra type assertion is necessary here because DefinitelyTyped hasn't updated its lru-cache type definitions
// to support the new `delete` method and the deprecated `del` method results in a runtime warning message
const sessionCache = new LRUCache<string, string>({ max: 1000 }) as
  LRUCache<string, string> & {delete: (key: string) => void;};

export function generateRandomToken(): string {
  return `session-${uuidV4()}`;
}

// logs user in, creates new session, and returns session token
// throws exception if credentials are incorrect
export async function logIn(loginRequest: LoginRequest): Promise<string> {
  const { token, userId } = await dbTransaction(async query => {
    // retrieve credentials from database
    const matching = await query(
      'SELECT "user_uuid", "password_hash" from users where username = $1;',
      [loginRequest.username],
      Schemas.recordOf({
        'user_uuid': Schemas.aString,
        'password_hash': Schemas.aString
      })
    );
    if (matching.length < 1) {
      throw new UserException(403, 'Incorrect username or password');
    }
    // validating bcrypt password hashes is asynchronous because it is slow by design
    if (!(await bcrypt.compare(loginRequest.password, matching[0].password_hash))) {
      throw new UserException(403, 'Incorrect username or password');
    }
    // randomly generate new session token
    const token = generateRandomToken();
    // add session to database and cache
    const userId = matching[0].user_uuid;
    await query('INSERT INTO sessions(token, user_uuid) VALUES ($1, $2);', [token, userId], dontValidate);

    return { token, userId };
  });
  sessionCache.set(token, userId);
  return token;
}

export async function logOut(token: string): Promise<void> {
  sessionCache.delete(token);
  await dbQuery('delete from sessions where token = $1;', [token], dontValidate);
}

// checks whether a token corresponds to an active session
export async function isValidSession(token: string): Promise<boolean> {
  if (sessionCache.has(token)) {
    return true;
  }
  return await dbTransaction(async query => {
    const matchingSessions = await query('select 1 from sessions where token = $1;', [token], dontValidate);
    return matchingSessions.length > 0;
  });
}

// maps from session token to user UUID
export async function lookupSessionUser(token: string): Promise<string> {
  const cached = sessionCache.get(token);
  if (cached) {
    return cached;
  }
  const rows = await dbQuery(
    'select user_uuid from sessions where token = $1;', [token],
    Schemas.recordOf({ user_uuid: Schemas.aString })
  );
  if (rows.length < 0) {
    throw new UserException(401, 'Your session is not authenticated. Try signing out and signing back in.');
  }
  return rows[0].user_uuid;
}
