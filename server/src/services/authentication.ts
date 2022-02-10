import LRUCache from "lru-cache";
import { dbTransaction } from "../util/db";
import { Schemas } from "@nprindle/augustus";
import { elementsMatchSchema, isArray, isArrayOf } from "../util/typeGuards";
import { UserException } from "../util/errors";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';

// maps recently-used session tokens to user uuids
const sessionCache = new LRUCache<string, string>(1000);

// logs user in, creates new session, and returns session token
// throws exception if credentials are incorrect
export async function logIn(username: string, password: string): Promise<string> {
  return await dbTransaction(async query => {
    // retrieve credentials from database
    const matching = await query(
      `SELECT "user_uuid", "password_hash" from users where username = $1;`,
      [username],
      elementsMatchSchema(Schemas.recordOf({
        "user_uuid": Schemas.aString,
        "password_hash": Schemas.aString
      }))
    );
    if (matching.length < 1) {
      throw new UserException(403, 'Incorrect username or password');
    }
    // validating bcrypt password hashes is asynchronous because it is slow by design
    if (!(await bcrypt.compare(password, matching[0].password_hash))) {
      throw new UserException(403, 'Incorrect username or password');
    }
    // randomly generate new session token
    const token = `session-${uuidV4()}`;
    // add session to database and cache
    const userId = matching[0].user_uuid;
    await query(`INSERT INTO sessions(token, user_uuid) VALUES ($1, $2);`, [token, userId], isArray);
    sessionCache.set(token, userId);

    return token
  });
}
