import { Json, Schema } from '@nprindle/augustus';
import axios from 'axios';
import { BUSYBODY_TOKEN_HEADER_NAME, Endpoint } from 'busybody-core';
import path from 'path-browserify';
type JsonValue = Json.JsonValue;

const API_BASE_URL = process.env.REACT_APP_BB_SERVER_URL!;
console.log('api url:', API_BASE_URL); // TODO remove logging

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
  const url = new URL(path.join(new URL(API_BASE_URL).pathname, endpoint.relativePath), API_BASE_URL).toString();
  console.log('request to', url); // TODO remove logging
  const config = {
    params: endpoint.querySchema.encode(queryParams),
    headers: getHeader(token)
  };
  const payload = endpoint.requestSchema.encode(request);
  const result = await {
    post:    async (r: ReqRepr) => await axios.post(url, r, config),
    put:     async (r: ReqRepr) => await axios.put(url, r, config),
    get:     async () => await axios.get(url, config),
    delete:  async () => await axios.delete(url, config),
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

