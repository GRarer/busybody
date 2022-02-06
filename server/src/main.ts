import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import {ServerStatusResponse} from "busybody-core";

const SERVER_PORT = 3001;

console.log("Starting busybody server...")

const server: FastifyInstance = Fastify({})
server.register(fastifyCors, {origin: true});

server.get('/status', {}, async (request, reply) => {
  const status: ServerStatusResponse = {
    status: "BusyBody server online",
    time: (new Date()).toString()
  }
  return status;
});

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

