import { Schemas } from '@nprindle/augustus';
import { PostEndpoint, GetEndpoint } from '..';

export type LoginRequest = { username: string; password: string; };

// creates a new user session and returns the session token
// will throw "unauthorized" exception if credentials are incorrect
export const loginEndpoint: PostEndpoint<LoginRequest, {}, string> = {
  method: 'post',
  relativePath: '/login',
  requestValidator: Schemas.recordOf({
    username: Schemas.aString,
    password: Schemas.aString,
  }).validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aString.validate // returns token
};

// no payload or queries because the session to be logged out will be identified by its token header
export const logoutEndpoint: PostEndpoint<undefined, {}, null> = {
  method: 'post',
  relativePath: '/logout',
  requestValidator: Schemas.anUndefined.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aNull.validate,
};

export const sessionActiveEndpoint: GetEndpoint<{}, boolean> = {
  method: 'get',
  relativePath: '/session_is_active',
  requestValidator: Schemas.anUndefined.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aBoolean.validate,
};
