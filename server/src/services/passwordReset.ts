import { DomainOf, Schemas } from '@nprindle/augustus';
import { dbQuery, dbTransaction } from '../util/db.js';
import bcrypt from 'bcrypt';
import { dontValidate } from '../util/typeGuards.js';
import { currentTimeSeconds, resetPasswordEndpoint } from 'busybody-core';
import { sendPasswordResetAccountNotFoundEmail, sendPasswordResetEmail } from './mail/mail.js';
import { UserException } from '../util/errors.js';
import { generateRandomToken } from './authentication.js';
import { randomCode } from '../util/random.js';

export async function requestPasswordReset(email: string): Promise<void> {
  const result: {code: string; username: string;} | null = await dbTransaction(async query => {
    const userResults = await query(
      'select user_uuid, username from users where email = $1;', [email],
      Schemas.recordOf({
        user_uuid: Schemas.aString,
        username: Schemas.aString
      })
    );
    if (userResults.length === 0) {

      return null;
    }
    const userUUID = userResults[0].user_uuid;
    const username = userResults[0].username;

    // TODO 8-digit decimal numbers probably don't have enough entropy
    // generate random reset code
    const code = randomCode(8, 'cryptographic');
    const codeHash = await bcrypt.hash(code, 10);

    // TODO implement removing expired codes
    await query(
      `insert into password_reset_requests ("user_uuid", "email", "reset_code_hash", "expiration")
      values ($1, $2, $3, $4);`,
      [userUUID, email, codeHash, currentTimeSeconds() + 3600], dontValidate
    );
    return ({ code, username });
  });
  if (result === null) {
    await sendPasswordResetAccountNotFoundEmail(email);
  } else {
    await sendPasswordResetEmail({ address: email, username: result.username, code: result.code });
  }
}

export async function resetPassword(args: DomainOf<typeof resetPasswordEndpoint.requestSchema>): Promise<string> {
  const matchingResetRequests = await dbQuery(
    'select user_uuid, reset_code_hash from password_reset_requests where email = $1;',
    [args.email],
    Schemas.recordOf({
      user_uuid: Schemas.aString,
      reset_code_hash: Schemas.aString
    })
  );

  let authorized = false;
  for (const hash of matchingResetRequests.map(r => r.reset_code_hash)) {
    if (!authorized && (await bcrypt.compare(args.resetCode, hash))) {
      authorized = true;
    }
  }
  if (!authorized) {
    throw new UserException(403, 'Incorrect or expired reset code');
  }

  const userUUID = matchingResetRequests[0].user_uuid;
  const newPasswordHash = await bcrypt.hash(args.newPassword, 10);
  await dbQuery(
    'update users set password_hash = $1 where user_uuid = $2',
    [newPasswordHash, userUUID], dontValidate
  );
  const sessionToken = generateRandomToken();
  await dbQuery('insert into sessions ("token", "user_uuid") values ($1, $2);', [sessionToken, userUUID], dontValidate);
  return sessionToken;
}
