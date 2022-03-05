import { Schema, Schemas } from '@nprindle/augustus';
import { GetEndpointSimple, PutEndpointSimple } from '../apis.js';

export type FriendInfo = {
  uuid: string;
  username: string;
  fullName: string;
  avatarUrl: string | undefined;
};

export type FriendsListResponse = {
  friends: FriendInfo[];
  incomingRequests: FriendInfo[];
  outgoingRequests: FriendInfo[];
};

export const friendInfoSchema = Schemas.recordOf({
  uuid: Schemas.aString,
  username: Schemas.aString,
  fullName: Schemas.aString,
  avatarUrl: Schemas.optional(Schemas.aString)
});

const friendsListResponseSchema: Schema<FriendsListResponse, FriendsListResponse> = Schemas.recordOf({
  friends: Schemas.arrayOf(friendInfoSchema),
  incomingRequests: Schemas.arrayOf(friendInfoSchema),
  outgoingRequests: Schemas.arrayOf(friendInfoSchema),
});

export const getFriendsListEndpoint = new GetEndpointSimple('/friends_list', friendsListResponseSchema);



export const sendFriendRequestEndpoint = new PutEndpointSimple('/send_friend_request', {
  requestSchema: Schemas.recordOf({ username: Schemas.aString }),
  responseSchema: friendsListResponseSchema
});



export const answerRequestEndpoint = new PutEndpointSimple('/answer_friend_request', {
  requestSchema: Schemas.recordOf({
    uuid: Schemas.aString,
    accept: Schemas.aBoolean
  }),
  responseSchema: friendsListResponseSchema
});

export const cancelFriendRequestEndpoint = new PutEndpointSimple('/cancel_friend_request', {
  requestSchema: Schemas.recordOf({
    uuid: Schemas.aString,
  }),
  responseSchema: friendsListResponseSchema
});

export const unfriendEndpoint = new PutEndpointSimple('/unfriend', {
  requestSchema: Schemas.recordOf({
    uuid: Schemas.aString,
  }),
  responseSchema: friendsListResponseSchema
});
