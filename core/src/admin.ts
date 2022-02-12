import { DomainOf, Schemas } from '@nprindle/augustus';
import { Endpoint, GetEndpoint } from './apis';

const ServerStatusResponseSchema = Schemas.recordOf({
  status: Schemas.aString,
  time: Schemas.aString,
  userCount: Schemas.aNumber,
});

export type ServerStatusResponse = DomainOf<typeof ServerStatusResponseSchema>;

export const serverStatusEndpoint: GetEndpoint<{}, ServerStatusResponse> = {
  relativePath: '/status',
  method: 'get',
  requestSchema: Schemas.anUndefined,
  querySchema: Schemas.recordOf({}),
  responseSchema: ServerStatusResponseSchema,
};


export const serverStatusEndpoint2: Endpoint<undefined, {}, ServerStatusResponse> = {
  relativePath: '/status',
  method: 'get',
  requestSchema: Schemas.anUndefined,
  querySchema: Schemas.recordOf({}),
  responseSchema: ServerStatusResponseSchema,
};


