// common utilities for API endpoints

import { Json, Schema, Schemas } from '@nprindle/augustus';

export const BUSYBODY_TOKEN_HEADER_NAME = 'bb_token';

type JsonValue = Json.JsonValue;

export interface Endpoint<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
> {
  // get and delete requests are required to have undefined request bodies
  readonly method: ReqRepr extends undefined ? 'get' | 'delete' | 'post' | 'put' : 'post' | 'put';
  readonly relativePath: string;
  readonly requestSchema: Schema<Request, ReqRepr>;
  readonly querySchema: Schema<Query, QRepr>;
  readonly responseSchema: Schema<Response, ResRepr>;
}

// classes for constructing endpoint instances
export class GetEndpoint<Query, Response, QRepr extends Record<string, string>, ResRepr extends JsonValue>
implements Endpoint<undefined, Query, Response, undefined, QRepr, ResRepr> {

  readonly method = 'get' as const;
  readonly requestSchema = Schemas.anUndefined;
  readonly querySchema: Schema<Query, QRepr>;
  readonly responseSchema: Schema<Response, ResRepr>;

  constructor(readonly relativePath: string, schemas: {
    querySchema: Schema<Query, QRepr>;
    responseSchema: Schema<Response, ResRepr>;
  }) {
    this.querySchema = schemas.querySchema;
    this.responseSchema = schemas.responseSchema;
  }
}

export class DeleteEndpoint<Query, Response, QRepr extends Record<string, string>, ResRepr extends JsonValue>
implements Endpoint<undefined, Query, Response, undefined, QRepr, ResRepr> {

  readonly method = 'delete' as const;
  readonly requestSchema = Schemas.anUndefined;
  readonly querySchema: Schema<Query, QRepr>;
  readonly responseSchema: Schema<Response, ResRepr>;

  constructor(readonly relativePath: string, schemas: {
    querySchema: Schema<Query, QRepr>;
    responseSchema: Schema<Response, ResRepr>;
  }) {
    this.querySchema = schemas.querySchema;
    this.responseSchema = schemas.responseSchema;
  }
}

export class PostEndpoint<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
> implements Endpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr> {
  readonly method = 'post' as const;
  readonly requestSchema: Schema<Request, ReqRepr>;
  readonly querySchema: Schema<Query, QRepr>;
  readonly responseSchema: Schema<Response, ResRepr>;

  constructor(readonly relativePath: string, schemas: {
    requestSchema: Schema<Request, ReqRepr>;
    querySchema: Schema<Query, QRepr>;
    responseSchema: Schema<Response, ResRepr>;
  }) {
    this.requestSchema = schemas.requestSchema;
    this.querySchema = schemas.querySchema;
    this.responseSchema = schemas.responseSchema;
  }
}

export class PutEndpoint<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
> implements Endpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr> {
  readonly method = 'put' as const;
  readonly requestSchema: Schema<Request, ReqRepr>;
  readonly querySchema: Schema<Query, QRepr>;
  readonly responseSchema: Schema<Response, ResRepr>;

  constructor(readonly relativePath: string, schemas: {
    requestSchema: Schema<Request, ReqRepr>;
    querySchema: Schema<Query, QRepr>;
    responseSchema: Schema<Response, ResRepr>;
  }) {
    this.requestSchema = schemas.requestSchema;
    this.querySchema = schemas.querySchema;
    this.responseSchema = schemas.responseSchema;
  }
}

// simple versions of endpoint constructors for when the query parameters are unused
export class GetEndpointSimple<Response, ResRepr extends JsonValue> extends GetEndpoint<{}, Response, {}, ResRepr> {
  constructor(relativePath: string, responseSchema: Schema<Response, ResRepr>) {
    super(relativePath, { responseSchema, querySchema: Schemas.recordOf({}) });
  }
}

export class DeleteEndpointSimple<Response, ResRepr extends JsonValue>
  extends DeleteEndpoint<{}, Response, {}, ResRepr> {

  constructor(relativePath: string, responseSchema: Schema<Response, ResRepr>) {
    super(relativePath, { responseSchema, querySchema: Schemas.recordOf({}) });
  }
}

export class PostEndpointSimple<Request, Response, ReqRepr extends JsonValue | undefined, ResRepr extends JsonValue>
  extends PostEndpoint<Request, {}, Response, ReqRepr, {}, ResRepr> {

  constructor(relativePath: string, schemas: {
    requestSchema: Schema<Request, ReqRepr>;
    responseSchema: Schema<Response, ResRepr>;
  }) {
    super(relativePath, {
      requestSchema: schemas.requestSchema,
      responseSchema: schemas.responseSchema,
      querySchema: Schemas.recordOf({})
    });
  }
}

export class PutEndpointSimple<Request, Response, ReqRepr extends JsonValue | undefined, ResRepr extends JsonValue>
  extends PutEndpoint<Request, {}, Response, ReqRepr, {}, ResRepr> {
  constructor(relativePath: string, schemas: {
    requestSchema: Schema<Request, ReqRepr>;
    responseSchema: Schema<Response, ResRepr>;
  }) {
    super(relativePath, {
      requestSchema: schemas.requestSchema,
      responseSchema: schemas.responseSchema,
      querySchema: Schemas.recordOf({})
    });
  }
}
