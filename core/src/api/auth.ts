import { Schemas } from '@nprindle/augustus';
import { DeleteEndpointSimple, GetEndpointSimple, PostEndpointSimple } from '../apis.js';

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
export const logoutEndpoint = new DeleteEndpointSimple('/session_status', Schemas.aNull);

export const sessionActiveEndpoint = new GetEndpointSimple('/session_status', Schemas.aBoolean);
