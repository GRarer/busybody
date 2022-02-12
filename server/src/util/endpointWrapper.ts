import { Endpoint } from 'busybody-core';
import { FastifyInstance } from 'fastify';

// adds a handler for the specified endpoint to the server
// with a wrapper that automatically validates the types of request body, query parameters, and response
export function attachHandlerWithSafeWrapper<Request, Query, Response>(
  server: FastifyInstance,
  endpoint: Endpoint<Request, Query, Response>,
  handler: (requestBody: Request, queryParams: Query) => Promise<Response>
): void {
  const method: 'get' | 'post' | 'put' | 'delete' = endpoint.method;
  server[method](endpoint.relativePath, {}, async (request, reply) => {
    const reqBody: unknown = request.body ?? undefined;
    const reqQueryParams: unknown = request.query ?? {};
    if (!endpoint.requestSchema.validate(reqBody)) {
      await reply.code(400);
      throw new Error('request body did not match expected format');
    }
    if (!endpoint.querySchema.validate(reqQueryParams)) {
      await reply.code(400);
      throw new Error('query parameters did not match expected format');
    }
    const response = await handler(endpoint.requestSchema.decode(reqBody), endpoint.querySchema.decode(reqQueryParams));
    return endpoint.responseSchema.encode(response);
  });
}
