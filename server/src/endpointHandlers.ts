import { Json } from '@nprindle/augustus';
import { Endpoint, loginEndpoint, logoutEndpoint, registrationEndpoint, selfInfoEndpoint, serverStatusEndpoint,
  sessionActiveEndpoint,
  updateEmailEndpoint,
  updatePasswordEndpoint,
  updatePersonalInfoEndpoint } from 'busybody-core';
import { FastifyInstance } from 'fastify';
import { getSelfInfo, register, updateAccountInfo, updateEmailAddress,
  updatePassword } from './services/accountInfo.js';
import { getServerStatus } from './services/admin.js';
import { isValidSession, logIn, logOut } from './services/authentication.js';
import { attachHandlerWithSafeWrapper } from './util/endpointWrapper.js';

// associates handlers with API endpoints and wraps them to provide consistent type-safety of API boundary

export function attachHandlers(server: FastifyInstance): void {
  const addHandler = <Request extends Json.JsonValue | undefined, Query, Response extends Json.JsonValue>(
    e: Endpoint<Request, Query, Response>,
    h: (requestBody: Request, queryParams: Query, token: string) => Promise<Response>
  ): void => attachHandlerWithSafeWrapper(server, e, h);

  // all API endpoint handlers are attached here

  // server admin and testing
  addHandler(serverStatusEndpoint, getServerStatus);

  // authentication
  addHandler(loginEndpoint, logIn);
  addHandler(logoutEndpoint, async (body, params, token) => {
    await logOut(token);
    return null;
  });
  addHandler(registrationEndpoint, register);
  addHandler(sessionActiveEndpoint, async (body, params, token) => isValidSession(token));

  // user accounts and settings
  addHandler(selfInfoEndpoint, async (body, params, token) => {
    return await getSelfInfo(token);
  });
  addHandler(updatePersonalInfoEndpoint, async (body, params, token) => {
    await updateAccountInfo(body, token);
    return null;
  });
  addHandler(updateEmailEndpoint, async (body, params, token) => {
    await updateEmailAddress(body, token);
    return null;
  });
  addHandler(updatePasswordEndpoint, async (body, params, token) => {
    await updatePassword(body, token);
    return null;
  });



}
