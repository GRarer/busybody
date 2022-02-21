import { Json, Schema } from '@nprindle/augustus';
import axios from 'axios';
import { BUSYBODY_TOKEN_HEADER_NAME, DeleteEndpoint, GetEndpoint, PostEndpoint, PutEndpoint } from 'busybody-core';
type JsonValue = Json.JsonValue;

const API_BASE_URL = 'http://localhost:3001';

function decodeResult<D, R>(data: unknown, schema: Schema<D, R>): D {
  if (schema.validate(data)) {
    return schema.decode(data);
  } else {
    console.error('data does not match schema');
    console.log(data);
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

export async function apiGet<Query, Response, QRepr extends Record<string, string>, ResRepr extends JsonValue>(
  endpoint: GetEndpoint<Query, Response, QRepr, ResRepr>,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  // TODO safer url append
  const result = await axios.get(
    API_BASE_URL + endpoint.relativePath,
    {
      params: endpoint.querySchema.encode(queryParams),
      headers: getHeader(token)
    }
  );
  return decodeResult(result.data, endpoint.responseSchema);
}

export async function apiDelete<Query, Response, QRepr extends Record<string, string>, ResRepr extends JsonValue>(
  endpoint: DeleteEndpoint<Query, Response, QRepr, ResRepr>,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  // TODO safer url append
  const result = await axios.delete(
    API_BASE_URL + endpoint.relativePath,
    {
      params: endpoint.querySchema.encode(queryParams),
      headers: getHeader(token)
    }
  );
  return decodeResult(result.data, endpoint.responseSchema);
}

export async function apiPost<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
>(
  endpoint: PostEndpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr>,
  request: Request,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  // TODO safer url append
  const result = await axios.post(
    API_BASE_URL + endpoint.relativePath,
    endpoint.requestSchema.encode(request),
    {
      params: endpoint.querySchema.encode(queryParams),
      headers: getHeader(token)
    }
  );
  return decodeResult(result.data, endpoint.responseSchema);
}

export async function apiPut<
  Request, Query, Response,
  ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
>(
  endpoint: PutEndpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr>,
  request: Request,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  // TODO safer url append
  const result = await axios.put(
    API_BASE_URL + endpoint.relativePath,
    endpoint.requestSchema.encode(request),
    {
      params: endpoint.querySchema.encode(queryParams),
      headers: getHeader(token)
    }
  );
  return decodeResult(result.data, endpoint.responseSchema);
}

