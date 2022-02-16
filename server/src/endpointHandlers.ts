import { Endpoint, loginEndpoint, logoutEndpoint, selfInfoEndpoint, serverStatusEndpoint,
  sessionActiveEndpoint } from 'busybody-core';
import { FastifyInstance } from 'fastify';
import { getSelfInfo } from './services/accountInfo.js';
import { getServerStatus } from './services/admin.js';
import { isValidSession, logIn, logOut } from './services/authentication.js';
import { attachHandlerWithSafeWrapper } from './util/endpointWrapper.js';

// associates handlers with API endpoints and wraps them to provide consistent type-safety of API boundary

export function attachHandlers(server: FastifyInstance): void {
  const addHandler = <Request, Query, Response>(
    e: Endpoint<Request, Query, Response>,
    h: (requestBody: Request, queryParams: Query, token: string) => Promise<Response>
  ): void => attachHandlerWithSafeWrapper(server, e, h);

  // all API endpoint handlers are attached here

  // server admin and testing stuff
  addHandler(serverStatusEndpoint, getServerStatus);

  // authentication
  addHandler(loginEndpoint, logIn);
  addHandler(logoutEndpoint, async (body, params, token) => {
    await logOut(token);
    return undefined;
  });
  addHandler(sessionActiveEndpoint, async (body, params, token) => isValidSession(token));

  // user accounts
  addHandler(selfInfoEndpoint, async (body, params, token) => {
    return await getSelfInfo(token);
  });


}
