import { DomainOf, Schemas } from '@nprindle/augustus';
import { PostEndpoint } from '.';

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
  responseSchema: Schemas.aString
};
