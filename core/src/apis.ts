// common utilities for API endpoints

import { Schema, Schemas } from "@nprindle/augustus";

// TODO constrain representation types to extend JsonValue or undefined
type JsonRepresentation = unknown;

// endpoints specify the url path, HTTP method, and the schemas of the request and response types
// request type for GET and Delete must be undefined
export type Endpoint<Request, Query, Response, > = (
  {
    relativePath: string,
    requestSchema: Schema<Request, JsonRepresentation>,
    querySchema: Schema<Query, Record<string, string>>,
    responseSchema: Schema<Response, JsonRepresentation>,
  } & (
    {
      method: "post" | "put"
    } | {
      method: "get" | "delete",
      // get and delete cannot have request data
      requestSchema: Schema<undefined, undefined>
    }
  )
)

export type GetEndpoint<Query, Response> = Endpoint<undefined, Query, Response> & {method: "get"};


// TODO this appears to allow some problems
// const e1: GetEndpoint<{}, {a: string, b: string}> = {
//   relativePath: "/example",
//   method: "get",
//   requestSchema: Schemas.anUndefined,
//   querySchema: Schemas.recordOf({}),
//   responseSchema: Schemas.recordOf({
//     a: Schemas.aString,
//     b: Schemas.aString
//   }),
// };
// const e2: GetEndpoint<{}, {a: string}> = e1;
// // actually this is an issue for augustus too
// const s1: Schema<{a:string, b: string},{a:string, b: string}> = Schemas.recordOf({
//   a: Schemas.aString,
//   b: Schemas.aString
// });
// const s2: Schema<{a:string}, {a:string}> = s1;

