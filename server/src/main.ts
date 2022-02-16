import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from 'fastify-cors';
import { attachHandlers } from './endpointHandlers.js';
import { serverConfiguration } from './util/config.js';
import { dbQuery, disconnectDatabase } from './util/db.js';
import { dontValidate } from './util/typeGuards.js';

const SERVER_PORT = serverConfiguration.apiPort;

console.log('Starting busybody server...');

const server: FastifyInstance = Fastify({});

async function start(): Promise<void> {
  // verify database is connected
  await dbQuery('select 1;', [], dontValidate);
  console.log('Database connected');
  console.log('Starting http server...');
  await server.register(fastifyCors, { origin: true });
  attachHandlers(server);
  await server.listen(SERVER_PORT);
  const address = server.server.address();
  const port = typeof address === 'string' ? address : address?.port;
  console.log(`Started server on ${port}`);
}

// set up handlers for server shutdown
async function cleanShutdown(): Promise<void> {
  await server.close();
  await disconnectDatabase();
}
// attach signal/event handlers to run before exiting
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal => {
  process.on(signal, function() {
    console.log('shutting down...');
    cleanShutdown().then(() => {
      console.log('shutdown complete');
    }).catch(reason => {
      console.error('failed to shut down cleanly');
      console.log(reason);
    }).finally(() => {
      process.exit();
    });
  });
});

start().catch(err => {
  server.log.error(err);
  process.exit(1);
});

