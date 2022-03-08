import { Json, Schema } from '@nprindle/augustus';
import axios from 'axios';
import { BUSYBODY_TOKEN_HEADER_NAME, Endpoint } from 'busybody-core';
type JsonValue = Json.JsonValue;

const API_BASE_URL = 'http://localhost:3001';

function decodeResult<D, R>(data: unknown, schema: Schema<D, R>): D {
  if (schema.validate(data)) {
    return schema.decode(data);
  } else {
    console.error('data does not match schema');
    throw new Error('Server response did not match expected format');
  }
}

function getHeader(token: string | null): { [BUSYBODY_TOKEN_HEADER_NAME]: string; } | Record<never, never> {
  if (token === null) {
    return { 'Content-Type': 'application/json' };
  } else {
    return ({
      'Content-Type': 'application/json',
      [BUSYBODY_TOKEN_HEADER_NAME]: token
    });
  }
}

async function apiRequest<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
>(
  endpoint: Endpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr>,
  request: Request,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  const path = new URL(endpoint.relativePath, API_BASE_URL).toString();
  const config = {
    params: endpoint.querySchema.encode(queryParams),
    headers: getHeader(token)
  };
  const payload = endpoint.requestSchema.encode(request);
  const result = await {
    post:    async (r: ReqRepr) => await axios.post(path, r, config),
    put:     async (r: ReqRepr) => await axios.put(path, r, config),
    get:     async () => await axios.get(path, config),
    delete:  async () => await axios.delete(path, config),
  }[endpoint.method](payload);
  return decodeResult(result.data, endpoint.responseSchema);
}

export async function apiGet<Query, Response, QRepr extends Record<string, string>, ResRepr extends JsonValue>(
  endpoint: Endpoint<undefined, Query, Response, undefined, QRepr, ResRepr> & {method: 'get';},
  queryParams: Query,
  token: string | null
): Promise<Response> {
  return apiRequest(endpoint, undefined, queryParams, token);
}

export async function apiDelete<Query, Response, QRepr extends Record<string, string>, ResRepr extends JsonValue>(
  endpoint: Endpoint<undefined, Query, Response, undefined, QRepr, ResRepr> & {method: 'delete';},
  queryParams: Query,
  token: string | null
): Promise<Response> {
  return apiRequest(endpoint, undefined, queryParams, token);
}

export async function apiPost<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
>(
  endpoint: Endpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr> & {method: 'post';},
  request: Request,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  return apiRequest(endpoint, request, queryParams, token);
}

export async function apiPut<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
>(
  endpoint: Endpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr> & {method: 'put';},
  request: Request,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  return apiRequest(endpoint, request, queryParams, token);
}

