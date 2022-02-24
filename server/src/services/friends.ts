import { Schemas } from '@nprindle/augustus';
import { FriendInfo, FriendsListResponse } from 'busybody-core';
import { dbQuery, dbTransaction } from '../util/db.js';
import { UserException } from '../util/errors.js';
import { absurd, dontValidate } from '../util/typeGuards.js';
import { lookupSessionUser } from './authentication.js';

// also used to look up watcher information for tasks
export const currentFriendsQuery = `select user_uuid, username, full_name from users join friends_symmetric
on friends_symmetric.friend = users.user_uuid where friends_symmetric.this_user = $1;`;
export const databaseFriendInfoValidator = Schemas.recordOf({
  user_uuid: Schemas.aString,
  username: Schemas.aString,
  full_name: Schemas.aString
}).validate;

export async function getUserFriendsList(token: string): Promise<FriendsListResponse> {
  const uuid = await lookupSessionUser(token);
  const result = await dbTransaction(async query => {
    const friends = await query(currentFriendsQuery, [uuid], databaseFriendInfoValidator);
    const incoming = await query(
      `select user_uuid, username, full_name
      from users join friend_requests on friend_requests.from_user = users.user_uuid
      where friend_requests.to_user = $1;`, [uuid], databaseFriendInfoValidator
    );
    const outgoing = await query(
      `select user_uuid, username, full_name
      from users join friend_requests on friend_requests.to_user = users.user_uuid
      where friend_requests.from_user = $1;`, [uuid], databaseFriendInfoValidator
    );

    const convertResult = (row: { user_uuid: string; username: string; full_name: string; }): FriendInfo => ({
      uuid: row.user_uuid,
      username: row.username,
      fullName: row.full_name
    });

    return {
      friends: friends.map(convertResult),
      incomingRequests: incoming.map(convertResult),
      outgoingRequests: outgoing.map(convertResult),
    };

  });
  return result;
}

export async function sendFriendRequest(senderToken: string, recipient: { username: string; }): Promise<void> {
  const senderUUID = await lookupSessionUser(senderToken);
  await dbTransaction(async query => {
    // look up UUID for the given username
    const recipientInfo = await query(
      'select user_uuid from users where username=$1;', [recipient.username],
      Schemas.recordOf({ user_uuid: Schemas.aString }).validate
    );
    if (recipientInfo.length === 0) {
      throw new UserException(404, 'No user with that username exists');
    }
    const recipientUUID = recipientInfo[0].user_uuid;

    // check for existing friendship or friend request
    const countsRowSchema = Schemas.recordOf({
      count: Schemas.aNumber,
      // TODO there's gotta be a better way to define 3-element schemas. maybe PR augustus?
      category: Schemas.union(
        Schemas.literal('existing' as const),
        Schemas.union(Schemas.literal('incoming' as const), Schemas.literal('outgoing' as const))
      )
    });
    const counts = await query(
      `with existing as (
        select count(*), 'existing' as category from friends_symmetric
        where this_user = $1 and friend = $2
      ), outgoing as (
        select count(*), 'outgoing' as category from friend_requests
        where from_user = $1 and to_user = $2
      ), incoming as (
        select count(*), 'incoming' as category from friend_requests
        where to_user = $1 and from_user = $2
      ), totals as (
        select * from existing union select * from outgoing union select * from incoming
      ) select * from totals where count > 0;`,
      [senderUUID, recipientUUID],
      countsRowSchema.validate
    );
    for (const nonzeroCountCategory of counts.filter(count => count.count !== 0).map(count => count.category)) {
      if (nonzeroCountCategory === 'existing') {
        throw new UserException(409, 'You are already friends with that user');
      } else if (nonzeroCountCategory === 'incoming') {
        throw new UserException(409, 'That user has already sent you a friend request');
        // this is for totality checking
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (nonzeroCountCategory === 'outgoing') {
        throw new UserException(409, 'You already sent a friend request to that user');
      } else {
        absurd(nonzeroCountCategory);
      }
    }

    // create friend request
    await query(
      'INSERT INTO friend_requests (from_user, to_user) VALUES ($1, $2);', [senderUUID, recipientUUID], dontValidate
    );
  });
}

export async function answerFriendRequest(
  recipientToken: string,
  requestAnswer: {uuid: string; accept: boolean;}): Promise<void> {
  const recipientUUID = await lookupSessionUser(recipientToken);
  const senderUUID = requestAnswer.uuid;
  await dbTransaction(async query => {
    // verify that there is a friend request between these users
    const matchingRequests = await query(
      'select * from friend_requests where from_user = $1 and to_user = $2;',
      [senderUUID, recipientUUID], dontValidate
    );
    if (matchingRequests.length === 0) {
      throw new UserException(404, 'You do not have a friend request from that user');
    }

    // remove the request
    await query(
      'delete from friend_requests where from_user = $1 and to_user = $2;', [senderUUID, recipientUUID], dontValidate
    );

    if (requestAnswer.accept) {
      // create the friendship
      await query(
        'INSERT INTO friendships (user_a, user_b) VALUES ($1, $2)', [senderUUID, recipientUUID], dontValidate
      );
    }
  });
}

export async function cancelFriendRequest(sessionToken: string, recipientUUID: string): Promise<void> {
  const userUUID = await lookupSessionUser(sessionToken);
  await dbQuery(
    'delete from friend_requests where from_user = $1 and to_user = $2;', [userUUID, recipientUUID], dontValidate
  );
}

export async function unfriend(sessionToken: string, friendUUID: string): Promise<void> {
  const userUUID = await lookupSessionUser(sessionToken);
  // TODO probably need to also remove watching any tasks where these two users are friends
  await dbQuery(
    'delete from friendships where (((user_a = $1) and (user_b = $2)) or ((user_a = $2) and (user_b = $1)))',
    [userUUID, friendUUID], dontValidate
  );
}
