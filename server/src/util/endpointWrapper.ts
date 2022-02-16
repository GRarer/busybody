import { BUSYBODY_TOKEN_HEADER_NAME, Endpoint } from 'busybody-core';
import { FastifyInstance } from 'fastify';
import { UserException } from './errors.js';

// adds a handler for the specified endpoint to the server
// with a wrapper that automatically validates the types of request body, query parameters, and response
export function attachHandlerWithSafeWrapper<Request, Query, Response>(
  server: FastifyInstance,
  endpoint: Endpoint<Request, Query, Response>,
  handler: (requestBody: Request, queryParams: Query, token: string) => Promise<Response>
): void {
  const method: 'get' | 'post' | 'put' | 'delete' = endpoint.method;
  server[method](endpoint.relativePath, {}, async (request, reply) => {
    try {
      const reqBody: unknown = request.body ?? undefined;
      const reqQueryParams: unknown = request.query ?? {};
      if (!endpoint.requestSchema.validate(reqBody)) {
        throw new UserException(400, 'request body did not match expected format');
      }
      if (!endpoint.querySchema.validate(reqQueryParams)) {
        throw new UserException(400, 'query parameters did not match expected format');
      }

      const token_header = request.headers[BUSYBODY_TOKEN_HEADER_NAME];
      const token = typeof token_header === 'string' ? token_header : '';

      const response = await handler(
        endpoint.requestSchema.decode(reqBody),
        endpoint.querySchema.decode(reqQueryParams),
        token
      );
      return endpoint.responseSchema.encode(response);
    } catch (error: unknown) {
      if (error instanceof UserException) {
        return error;
      } else {
        console.log('unexpected error:');
        console.error(error);
        throw error;
      }
    }
  });
}
