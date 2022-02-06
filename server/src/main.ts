import Fastify, { FastifyInstance } from "fastify"
import fastifyCors from "fastify-cors";

const SERVER_PORT = 3001;

console.log("Starting busybody server...")

const server: FastifyInstance = Fastify({})
server.register(fastifyCors, {origin: true});

server.get('/status', {}, async (request, reply) => {
  return {
    identity: "BusyBody server",
    time: new Date()
  }
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

