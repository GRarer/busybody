// common utilities for API endpoints

import { Schema } from '@nprindle/augustus';
import { Json } from '@nprindle/augustus';

export const BUSYBODY_TOKEN_HEADER_NAME = 'bb_token';

type JsonValue = Json.JsonValue;

// endpoints specify the url path, HTTP method, and the schemas of the request and response types
// request type for GET and Delete must be undefined
export type Endpoint<Request extends JsonValue | undefined, Query, Response extends JsonValue> = (
  {
    relativePath: string;
    // request and response are always json-representable values
    requestValidator: (payload: unknown) => payload is Request;
    // query params must be serializable as string key-value pairs
    // augustus schemas can be used to convert if the domain type is different
    querySchema: Schema<Query, Record<string, string>>;
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


export type GetEndpoint<Query, Response extends JsonValue>
  = Endpoint<undefined, Query, Response> & {method: 'get';};
export type DeleteEndpoint<Query, Response extends JsonValue>
= Endpoint<undefined, Query, Response> & {method: 'delete';};
export type PostEndpoint<Request extends JsonValue | undefined, Query, Response extends JsonValue>
  = Endpoint<Request, Query, Response> & {method: 'post';};
export type PutEndpoint<Request extends JsonValue | undefined, Query, Response extends JsonValue>
= Endpoint<Request, Query, Response> & {method: 'put';};
