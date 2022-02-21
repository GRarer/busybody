import { Json } from '@nprindle/augustus';
import { BUSYBODY_TOKEN_HEADER_NAME, Endpoint } from 'busybody-core';
import { FastifyInstance } from 'fastify';
import { UserException } from './errors.js';

type JsonValue = Json.JsonValue;

// adds a handler for the specified endpoint to the server
// with a wrapper that automatically validates the types of request body, query parameters, and response
export function attachHandlerWithSafeWrapper<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
>(
  server: FastifyInstance,
  endpoint: Endpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr>,
  handler: (requestBody: Request, queryParams: Query, token: string) => Promise<Response>
): void {
  const method: 'get' | 'post' | 'put' | 'delete' = endpoint.method;
  server[method](endpoint.relativePath, {}, async (httpRequest, reply) => {
    try {
      const reqBody: unknown = httpRequest.body ?? undefined;
      const reqQueryParams: unknown = httpRequest.query ?? {};
      if (!endpoint.requestSchema.validate(reqBody)) {
        throw new UserException(400, 'request body did not match expected format');
      }
      if (!endpoint.querySchema.validate(reqQueryParams)) {
        throw new UserException(400, 'query parameters did not match expected format');
      }

      const token_header = httpRequest.headers[BUSYBODY_TOKEN_HEADER_NAME];
      const token = typeof token_header === 'string' ? token_header : '';
      const request = endpoint.requestSchema.decode(reqBody);
      const query = endpoint.querySchema.decode(reqQueryParams);

      return await handler(request, query, token);
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
