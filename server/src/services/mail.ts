import nodemailer from 'nodemailer';
import { serverConfiguration } from '../util/config.js';

function addressesIntoToField(addresses: string[]): string {
  return addresses.join(', ');
}

export async function sendHelloWorldEmail(addresses: string[]) {
  const to = addressesIntoToField(addresses);
  const transport = serverConfiguration.emailTransport;
  const result = await transport.sendMail({
    from: serverConfiguration.emailFromField,
    to,
    subject: "Hello",
    text: "Hello world in plain text!", // plain text body
    html: "<b>Hello world but bold!</b>", // html body
  });
  console.log("sent hello world.")
  console.log(result);
}

// sends watcher emails (and does not wait for transaction to be finished)
export function sendWatcherEmail(task: {
  watcherAddresses: string[],
  taskId: string,
  taskTitle: string,
  ownerNickname: string
}): void {
  const to = addressesIntoToField(task.watcherAddresses);
  const transport = serverConfiguration.emailTransport;

  // TODO render fancy HTML
  // TODO link to view task
  const body = `Busybody overdue task notification\ntitle: ${task.taskTitle}\nid: ${task.taskId}`

  transport.sendMail({
    from: serverConfiguration.emailFromField,
    to,
    subject: `${task.ownerNickname} missed their deadline for the task ${task.taskTitle}`,
    text: body
  }).catch(err => {
    console.error("failed to send task reminder emails");
    console.log(`affected recipients: ${to}`);
    console.log(`affected task: ${task.taskId} (${task.taskTitle})`);
    console.error(err);
  })
}
