import Fastify, { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandMethod } from "fastify";
import fastifyCors from "fastify-cors";
import {serverStatusEndpoint, Endpoint, ServerStatusResponse} from "busybody-core";

const SERVER_PORT = 3001;

console.log("Starting busybody server...")

const server: FastifyInstance = Fastify({})
server.register(fastifyCors, {origin: true});


async function statusHandler() {
  return {
    status: "BusyBody server online",
    time: (new Date()).toString()
  }
}

// adds endpoint handlers with wrappers for type safety
function addHandler<Request, Query, Response>(
  endpoint: Endpoint<Request, Query, Response>,
  handler: (requestBody: Request, queryParams: Query) => Promise<Response>
): void {

  //const addMethod = (path: string, handlerWrapper: any) => server.get(path, handlerWrapper);

  server.get(endpoint.relativePath, {}, async (request, reply) => {
    let reqBody: unknown = request.body ?? undefined;
    let reqQueryParams: unknown = request.query ?? {};

    if (!endpoint.requestSchema.validate(reqBody)) {
      reply.code(400);
      throw new Error("request body did not match expected format");
    }
    if (!endpoint.querySchema.validate(reqQueryParams)) {
      reply.code(400);
      throw new Error("query parameters did not match expected format");
    }
    const response = await handler(endpoint.requestSchema.decode(reqBody), endpoint.querySchema.decode(reqQueryParams));
    return endpoint.responseSchema.encode(response);
  });
}

// // all API endpoint handlers are attached here
addHandler(serverStatusEndpoint, statusHandler);



const start = async () => {
  try {
    await server.listen(SERVER_PORT)

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port;
    console.log(`Started server on ${port}`);

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()

