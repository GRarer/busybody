import { Schema, Schemas } from '@nprindle/augustus';
import { GetEndpoint, PutEndpoint } from '..';

export type FriendInfo = {
  uuid: string;
  username: string;
  fullName: string;
};

export type FriendsListResponse = {
  friends: FriendInfo[];
  incomingRequests: FriendInfo[];
  outgoingRequests: FriendInfo[];
};

const friendInfoSchema = Schemas.recordOf({
  uuid: Schemas.aString,
  username: Schemas.aString,
  fullName: Schemas.aString,
});

const friendsListResponseSchema: Schema<FriendsListResponse, FriendsListResponse> = Schemas.recordOf({
  friends: Schemas.arrayOf(friendInfoSchema),
  incomingRequests: Schemas.arrayOf(friendInfoSchema),
  outgoingRequests: Schemas.arrayOf(friendInfoSchema),
});

export const getFriendsListEndpoint: GetEndpoint<{}, FriendsListResponse> = {
  relativePath: '/friends_list',
  method: 'get',
  requestValidator: Schemas.anUndefined.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: friendsListResponseSchema.validate,
};

export const sendFriendRequestEndpoint: PutEndpoint<{username: string;}, {}, FriendsListResponse> = {
  relativePath: '/send_friend_request',
  method: 'put',
  requestValidator: Schemas.recordOf({ username: Schemas.aString }).validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: friendsListResponseSchema.validate
};

export const answerRequestEndpoint: PutEndpoint<{uuid: string; accept: boolean;}, {}, FriendsListResponse> = {
  relativePath: '/answer_friend_request',
  method: 'put',
  requestValidator: Schemas.recordOf({
    uuid: Schemas.aString,
    accept: Schemas.aBoolean
  }).validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: friendsListResponseSchema.validate
};

export const cancelFriendRequestEndpoint: PutEndpoint<{uuid: string;}, {}, FriendsListResponse> = {
  relativePath: '/cancel_friend_request',
  method: 'put',
  requestValidator: Schemas.recordOf({
    uuid: Schemas.aString,
  }).validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: friendsListResponseSchema.validate
};

export const unfriendEndpoint: PutEndpoint<{uuid: string;}, {}, FriendsListResponse> = {
  relativePath: '/unfriend',
  method: 'put',
  requestValidator: Schemas.recordOf({
    uuid: Schemas.aString,
  }).validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: friendsListResponseSchema.validate
};
