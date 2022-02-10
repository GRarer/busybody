import { Endpoint, GetEndpoint, serverStatusEndpoint } from "busybody-core";
import { FastifyInstance } from "fastify";
import { getServerStatus } from "./services/admin.js";
import { attachHandlerWithSafeWrapper} from "./util/endpointWrapper.js";

// associates handlers with API endpoints and wraps them to provide consistent type-safety of API boundary

export function attachHandlers(server: FastifyInstance): void {
  const addHandler = <Request,Query,Response>(
    e: Endpoint<Request, Query, Response>,
    h: (requestBody: Request, queryParams: Query) => Promise<Response>
  ) => attachHandlerWithSafeWrapper(server, e, h);
  // all API endpoint handlers are attached here
  addHandler(serverStatusEndpoint, getServerStatus);
}
