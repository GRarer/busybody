import { DomainOf, Schemas } from '@nprindle/augustus';
import { GetEndpointSimple } from '../apis.js';

const ServerStatusResponseSchema = Schemas.recordOf({
  status: Schemas.aString,
  time: Schemas.aString,
  userCount: Schemas.aNumber,
});

export type ServerStatusResponse = DomainOf<typeof ServerStatusResponseSchema>;

export const serverStatusEndpoint = new GetEndpointSimple('/status', ServerStatusResponseSchema);
