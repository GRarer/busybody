import { serverConfiguration } from '../util/config.js';
import { WatcherEmailBody } from './mailTemplates.js';
import ReactDOMServer from 'react-dom/server.js';

function send(addresses: string[], subject: string, body: JSX.Element | string) {
  serverConfiguration.emailTransport.sendMail({
    from: serverConfiguration.emailFromField,
    to: addresses.join(', '),
    subject,
    html: typeof body === "string" ? undefined : ReactDOMServer.renderToStaticMarkup(body),
    text: typeof body === "string" ? body : undefined
  }).catch(err => {
    console.error('failed to send email');
    console.error(err);
  });;
}

export async function sendHelloWorldEmail(addresses: string[]): Promise<void> {
  send(addresses, 'Hello', 'Hello world in plain text!')
}

// send watcher emails (and do not wait for transaction to be finished)
export function sendWatcherEmail(task: {
  watcherAddresses: string[];
  taskId: string;
  taskTitle: string;
  ownerNickname: string;
  ownerFullName: string;
}): void {
  send(
    task.watcherAddresses,
    `${task.ownerNickname} missed their deadline for the task ${task.taskTitle}`,
    WatcherEmailBody(task)
  );
}
