import { Schemas } from '@nprindle/augustus';
import { DeleteEndpointSimple, GetEndpointSimple, PostEndpointSimple, PutEndpoint, PutEndpointSimple } from '../apis.js';

export type LoginRequest = { username: string; password: string; };

// creates a new user session and returns the session token
// will throw "unauthorized" exception if credentials are incorrect
export const loginEndpoint = new PostEndpointSimple('/login', {
  requestSchema: Schemas.recordOf({
    username: Schemas.aString,
    password: Schemas.aString,
  }),
  responseSchema: Schemas.aString
});

// no payload or queries because the session to be logged out will be identified by its token header
export const logoutEndpoint = new DeleteEndpointSimple('/logout', Schemas.aNull);

export const sessionActiveEndpoint = new GetEndpointSimple('/session_status', Schemas.aBoolean);

// triggers a reset-password email
export const resetPasswordRequestEndpoint = new PostEndpointSimple('/request_password_reset', {
  requestSchema: Schemas.recordOf({
    email: Schemas.aString
  }),
  responseSchema: Schemas.aNull
});

// resets password using a one-time code sent in a reset-password email, and returns a new session token
export const resetPasswordEndpoint = new PutEndpointSimple('/reset_password', {
  requestSchema: Schemas.recordOf({
    email: Schemas.aString,
    resetCode: Schemas.aString,
    newPassword: Schemas.aString
  }),
  responseSchema: Schemas.aString
});
