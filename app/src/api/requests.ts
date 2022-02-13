import { Schema } from '@nprindle/augustus';
import axios from 'axios';
import { GetEndpoint, PostEndpoint } from 'busybody-core';

const API_BASE_URL = 'http://localhost:3001';

function decodeResult<T, S>(data: S, schema: Schema<T, S>): T {
  if (schema.validate(data)) {
    return schema.decode(data);
  } else {
    throw new Error('Server response did not match expected format');
  }
}

export async function apiGet<Query, Response, ResponseR=Response>(
  endpoint: GetEndpoint<Query, Response, ResponseR>,
  queryParams: Query
): Promise<Response> {
  // TODO safer url append
  const result = await axios.get(
    API_BASE_URL + endpoint.relativePath,
    { params: endpoint.querySchema.encode(queryParams) }
  );
  return decodeResult(result.data, endpoint.responseSchema);
}

export async function apiPost<Request, Query, Response, RequestR=Request, ResponseR=Response>(
  endpoint: PostEndpoint<Request, Query, Response, RequestR, ResponseR>,
  request: Request,
  queryParams: Query
): Promise<Response> {
  const payload = endpoint.requestSchema.encode(request);
  // TODO safer url append
  const result = await axios.post(
    API_BASE_URL + endpoint.relativePath,
    payload,
    { params: endpoint.querySchema.encode(queryParams) }
  );
  return decodeResult(result.data, endpoint.responseSchema);
}
