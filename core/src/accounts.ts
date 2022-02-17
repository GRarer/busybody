import { DomainOf, Schemas } from '@nprindle/augustus';
import { GetEndpoint, PostEndpoint, PutEndpoint } from '.';

export const registrationRequestSchema = Schemas.recordOf({
  username: Schemas.aString,
  password: Schemas.aString,
  fullName: Schemas.aString,
  nickname: Schemas.aString,
  email: Schemas.aString,
});

export type RegistrationRequest = DomainOf<typeof registrationRequestSchema>;

export const RegistrationEndpoint: PutEndpoint<RegistrationRequest, {}, string> = {
  method: 'put',
  relativePath: '/register',
  requestValidator: registrationRequestSchema.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aString.validate
};

// format requirements for usernames and passwords
// return undefined if no problem, or message if there is a problem
export function usernameRequirementProblem(username: string): string | undefined {
  if (username === '') {
    return 'Username cannot be empty';
  }
  if (username.length > 32) {
    return 'Username must not be longer than 32 characters';
  }
  // @ is disallowed to prevent usernames that look like email addresses
  // whitespace including u00A0 non-breaking space are disallowed
  for (const badCharacter of ['@', ' ', '\u00A0', '#', '/', '\\', "'", '"', '\n', '\t']) {
    if (username.includes(badCharacter)) {
      return (`Username cannot contain the character "${badCharacter}"`);
    }
  }
  return undefined;
}

export function passwordRequirementProblem(password: string): string | undefined {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return undefined;
}

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
