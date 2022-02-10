import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import { attachHandlers } from "./endpointHandlers.js";
import { serverConfiguration } from "./util/config.js";
import { dbTransaction } from "./util/db.js";
import { isEmpty } from "./util/typeGuards.js";

const SERVER_PORT = serverConfiguration.apiPort;

console.log("Starting busybody server...")

const server: FastifyInstance = Fastify({})
server.register(fastifyCors, {origin: true});

const start = async () => {
  try {
    // verify database is connected
    dbTransaction(async (query) => {
      query(`select 1;`, [], Array.isArray)
    });
    console.log("Database connected")

    console.log("Starting http server...")
    attachHandlers(server);
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

