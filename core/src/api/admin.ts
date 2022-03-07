import { DomainOf, Schemas } from '@nprindle/augustus';
import { GetEndpointSimple, PostEndpointSimple } from '../apis.js';

const ServerStatusResponseSchema = Schemas.recordOf({
  status: Schemas.aString,
  time: Schemas.aString,
  userCount: Schemas.aNumber,
});

export type ServerStatusResponse = DomainOf<typeof ServerStatusResponseSchema>;

export const serverStatusEndpoint = new GetEndpointSimple('/status', ServerStatusResponseSchema);

export const testEmailEndpoint = new PostEndpointSimple('/test_email', {
  requestSchema: Schemas.recordOf({
    to: Schemas.arrayOf(Schemas.aString),
  }),
  responseSchema: Schemas.aNull,
});

export const serverOnlineEndpoint = new GetEndpointSimple('/online', Schemas.literal(true));
