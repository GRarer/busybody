import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from 'fastify-cors';
import { attachHandlers } from './endpointHandlers.js';
import { sendPlaintextEmail } from './services/mail/mail.js';
import { loop } from './services/loop.js';
import { serverConfiguration } from './util/config.js';
import { dbQuery, disconnectDatabase } from './util/db.js';
import { dontValidate } from './util/typeGuards.js';

const SERVER_PORT = serverConfiguration.apiPort;

console.log('Starting busybody server...');

const server: FastifyInstance = Fastify({});

console.log('setting up shutdown handlers');
// set up handlers for server shutdown
async function cleanShutdown(): Promise<void> {
  await server.close();
  await disconnectDatabase();
}
function triggerCleanShutdown(): void {
  console.log('shutting down...');
  cleanShutdown().then(() => {
    console.log('shutdown complete');
  }).catch(reason => {
    console.error('failed to shut down cleanly');
    console.log(reason);
  }).finally(() => {
    process.exit();
  });
}
// attach signal/event handlers to run before exiting
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal => {
  process.on(signal, () => triggerCleanShutdown());
});

async function start(): Promise<void> {
  // verify database is connected
  console.log('checking database connection...');
  await dbQuery('select 1;', [], dontValidate);
  console.log('Database connected');
  // start loop to check for overdue tasks and send notifications
  console.log('starting loops...');
  void loop().catch(err => {
    console.error('unhandled error in overdue task loop');
    console.error(err);
    triggerCleanShutdown();
  });
  console.log('Starting http server...');
  await server.register(fastifyCors, { origin: true });
  attachHandlers(server);
  await server.listen(SERVER_PORT);
  const address = server.server.address();
  const port = typeof address === 'string' ? address : address?.port;
  console.log(`Started server on ${port}`);
  if (serverConfiguration.wakeUpEmailDestination) {
    try {
      await sendPlaintextEmail(
        [serverConfiguration.wakeUpEmailDestination],
        'busybody server started up',
        `time: ${new Date()}, port: ${serverConfiguration.apiPort}`
      );
    } catch (err) {
      console.error('unable to send wakeup email');
      console.error(err);
    }
  }
}

start().catch(err => {
  console.error(err);
  triggerCleanShutdown();
  process.exit(1);
});

