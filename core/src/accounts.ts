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
  requestValidator: Schemas.recordOf({
    username: Schemas.aString,
    password: Schemas.aString,
  }).validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aString.validate // returns token
};

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

export type SelfInfoResponse = {
  username: string;
  fullName: string;
  nickname: string;
  email: string;
};

export const selfInfoEndpoint: GetEndpoint<{}, SelfInfoResponse> = {
  method: 'get',
  relativePath: '/self',
  requestValidator: Schemas.anUndefined.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.recordOf({
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString,
    email: Schemas.aString,
  }).validate
};
