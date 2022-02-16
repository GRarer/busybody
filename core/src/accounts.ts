import { DomainOf, Schemas } from '@nprindle/augustus';
import { GetEndpoint, PostEndpoint } from '.';

export const registrationRequestSchema = Schemas.recordOf({
  username: Schemas.aString,
  password: Schemas.aString,
  fullName: Schemas.aString,
  nickname: Schemas.aString,
  email: Schemas.aString,
});

export type RegistrationRequest = DomainOf<typeof registrationRequestSchema>;

export const loginRequestSchema = Schemas.recordOf({
  username: Schemas.aString,
  password: Schemas.aString,
});

export type LoginRequest = DomainOf<typeof loginRequestSchema>;

// creates a new user session and returns the session token
// will throw "unauthorized" exception if credentials are incorrect
export const loginEndpoint: PostEndpoint<LoginRequest, {}, string> = {
  method: 'post',
  relativePath: '/login',
  requestSchema: loginRequestSchema,
  querySchema: Schemas.recordOf({}),
  responseSchema: Schemas.aString // returns token
};

export const logoutEndpoint: PostEndpoint<undefined, {}, undefined> = {
  method: 'post',
  relativePath: '/logout',
  requestSchema: Schemas.anUndefined,
  querySchema: Schemas.recordOf({}),
  responseSchema: Schemas.anUndefined,
};

export const sessionActiveEndpoint: GetEndpoint<{}, boolean> = {
  method: 'get',
  relativePath: '/session_is_active',
  requestSchema: Schemas.anUndefined,
  querySchema: Schemas.recordOf({}),
  responseSchema: Schemas.aBoolean,
};

export type SelfInfoResponse = {
  username: string;
  fullName: string;
  nickname: string;
  email: string;
};

export const selfInfoEndpoint: GetEndpoint<{}, SelfInfoResponse> = {
  method: 'get',
  relativePath: '/self',
  requestSchema: Schemas.anUndefined,
  querySchema: Schemas.recordOf({}),
  responseSchema: Schemas.recordOf({
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString,
    email: Schemas.aString,
  })
};
