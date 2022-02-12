import { Schema } from '@nprindle/augustus';
import axios from 'axios';
import { GetEndpoint } from 'busybody-core';

const API_BASE_URL = 'http://localhost:3001';

const sessionToken: string | undefined = undefined;

function getTokenHeader(): {} | {token: string;} {
  if (sessionToken === undefined) {
    return {};
  } else {
    return { token: sessionToken };
  }
}

function decodeResult<T, S>(data: S, schema: Schema<T, S>): T {
  if (schema.validate(data)) {
    return schema.decode(data);
  } else {
    throw new Error('Server response did not match expected format');
  }
}

export async function apiGet<Query, Response>(
  endpoint: GetEndpoint<Query, Response>,
  queryParams: Query
): Promise<Response> {
  // TODO safer url append
  const result = await axios.get(API_BASE_URL + endpoint.relativePath, {
    headers: getTokenHeader(),
    params: endpoint.querySchema.encode(queryParams),
  });
  return decodeResult(result.data, endpoint.responseSchema);
}
