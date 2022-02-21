// common utilities for API endpoints

import { Json } from '@nprindle/augustus';

export const BUSYBODY_TOKEN_HEADER_NAME = 'bb_token';

type JsonValue = Json.JsonValue;

// endpoints specify the url path, HTTP method, and the schemas of the request and response types
// request type for GET and Delete must be undefined
export type Endpoint<
  Request extends JsonValue | undefined,
  Query extends Record<string, string>,
  Response extends JsonValue
> = (
  {
    relativePath: string;
    // request and response are always json-representable values
    requestValidator: (payload: unknown) => payload is Request;
    // query parameters are always string key-value pairs
    queryValidator: (queryParams: unknown) => queryParams is Query;
    responseValidator: (payload: unknown) => payload is Response;
  } & (
    // get and delete requests cannot have nonempty request payload
    Request extends undefined ? {
      method: 'get' | 'delete' | 'post' | 'put';
    } : {
      method: 'post' | 'put';
    }
  )
);


export type GetEndpoint<Query extends Record<string, string>, Response extends JsonValue>
  = Endpoint<undefined, Query, Response> & {method: 'get';};
export type DeleteEndpoint<Query extends Record<string, string>, Response extends JsonValue>
= Endpoint<undefined, Query, Response> & {method: 'delete';};
export type PostEndpoint<
  Request extends JsonValue | undefined, Query extends Record<string, string>, Response extends JsonValue
> = Endpoint<Request, Query, Response> & {method: 'post';};
export type PutEndpoint<
  Request extends JsonValue | undefined, Query extends Record<string, string>, Response extends JsonValue
> = Endpoint<Request, Query, Response> & {method: 'put';};
