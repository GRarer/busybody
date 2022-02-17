import { Json } from '@nprindle/augustus';
import axios from 'axios';
import { BUSYBODY_TOKEN_HEADER_NAME, GetEndpoint, PostEndpoint, PutEndpoint } from 'busybody-core';

const API_BASE_URL = 'http://localhost:3001';

function validateResult<T, S>(data: S, validate: (x: unknown) => x is T): T {
  if (validate(data)) {
    return data;
  } else {
    throw new Error('Server response did not match expected format');
  }
}

function tokenHeader(token: string | null): { [BUSYBODY_TOKEN_HEADER_NAME]: string; } | Record<never, never> {
  if (token === null) {
    return {};
  } else {
    return ({ [BUSYBODY_TOKEN_HEADER_NAME]: token });
  }
}

export async function apiGet<Query, Response extends Json.JsonValue>(
  endpoint: GetEndpoint<Query, Response>,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  // TODO safer url append
  const result = await axios.get(
    API_BASE_URL + endpoint.relativePath,
    {
      params: endpoint.querySchema.encode(queryParams),
      headers: tokenHeader(token)
    }
  );
  return validateResult(result.data, endpoint.responseValidator);
}

export async function apiPost<Request extends Json.JsonValue | undefined, Query, Response extends Json.JsonValue>(
  endpoint: PostEndpoint<Request, Query, Response>,
  request: Request,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  // TODO safer url append
  const result = await axios.post(
    API_BASE_URL + endpoint.relativePath,
    request,
    {
      params: endpoint.querySchema.encode(queryParams),
      headers: tokenHeader(token)
    }
  );
  return validateResult(result.data, endpoint.responseValidator);
}

export async function apiPut<Request extends Json.JsonValue | undefined, Query, Response extends Json.JsonValue>(
  endpoint: PutEndpoint<Request, Query, Response>,
  request: Request,
  queryParams: Query,
  token: string | null
): Promise<Response> {
  // TODO safer url append
  const result = await axios.put(
    API_BASE_URL + endpoint.relativePath,
    request,
    {
      params: endpoint.querySchema.encode(queryParams),
      headers: tokenHeader(token)
    }
  );
  return validateResult(result.data, endpoint.responseValidator);
}
