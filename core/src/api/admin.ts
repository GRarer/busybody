import { DomainOf, Schemas } from '@nprindle/augustus';
import { GetEndpoint } from '../apis';

const ServerStatusResponseSchema = Schemas.recordOf({
  status: Schemas.aString,
  time: Schemas.aString,
  userCount: Schemas.aNumber,
});

export type ServerStatusResponse = DomainOf<typeof ServerStatusResponseSchema>;

export const serverStatusEndpoint: GetEndpoint<{}, ServerStatusResponse> = {
  relativePath: '/status',
  method: 'get',
  requestValidator: Schemas.anUndefined.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: ServerStatusResponseSchema.validate,
};

