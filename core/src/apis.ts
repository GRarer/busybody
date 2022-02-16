// common utilities for API endpoints

import { Schema } from '@nprindle/augustus';

export const BUSYBODY_TOKEN_HEADER_NAME = 'bb_token';

// endpoints specify the url path, HTTP method, and the schemas of the request and response types
// request type for GET and Delete must be undefined
export type Endpoint<Request, Query, Response, RequestR=Request, ResponseR=Response> = (
  {
    relativePath: string;
    requestSchema: Schema<Request, RequestR>;
    querySchema: Schema<Query, Record<string, string>>;
    responseSchema: Schema<Response, ResponseR>;
  } & (
    {
      method: 'post' | 'put';
    } | {
      method: 'get' | 'delete';
      // get and delete cannot have request data
      requestSchema: Schema<undefined, undefined>;
    }
  )
);


export type GetEndpoint<Query, Response, ResponseR=Response>
  = Endpoint<undefined, Query, Response, undefined, ResponseR> & {method: 'get';};
export type DeleteEndpoint<Query, Response, ResponseR=Response>
  = Endpoint<undefined, Query, Response, undefined, ResponseR> & {method: 'delete';};
export type PostEndpoint<Request, Query, Response, RequestR=Request, ResponseR=Response>
  = Endpoint<Request, Query, Response, RequestR, ResponseR> & {method: 'post';};
export type PutEndpoint<Request, Query, Response, RequestR=Request, ResponseR=Response>
= Endpoint<Request, Query, Response, RequestR, ResponseR> & {method: 'put';};
