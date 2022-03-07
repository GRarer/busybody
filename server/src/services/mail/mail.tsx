import { serverConfiguration } from '../../util/config.js';
import { FriendRequestEmailBody, WatcherEmailBody } from './mailTemplates.js';
import ReactDOMServer from 'react-dom/server.js';
import { smtpTransport } from './smtpConfig.js';
import React from 'react';

function send(addresses: string[], subject: string, body: JSX.Element | string): void {
  smtpTransport.sendMail({
    from: serverConfiguration.emailFromField,
    to: addresses.join(', '),
    subject,
    html: typeof body === 'string' ? undefined : ReactDOMServer.renderToStaticMarkup(body),
    text: typeof body === 'string' ? body : undefined
  }).catch(err => {
    console.error('failed to send email');
    console.error(err);
  });
}

export function sendPlaintextEmail(
  addresses: string[], subject: string = 'Hello', body: string = 'Hello world'
): void {
  send(addresses, subject, body);
}

// send watcher emails (and do not wait for transaction to be finished)
export function sendWatcherEmail(task: {
  watcherAddresses: string[];
  taskTitle: string;
  taskDescription: string;
  ownerNickname: string;
  ownerFullName: string;
}): void {
  send(
    task.watcherAddresses,
    `${task.ownerNickname} missed their deadline for the task ${task.taskTitle}`,
    WatcherEmailBody(task)
  );
}

export function sendFriendRequestEmail(args: {
  senderName: string,
  recipientEmailAddress: string
}): void {
  send(
    [args.recipientEmailAddress],
    'new Busybody friend request',
    FriendRequestEmailBody({senderName: args.senderName})
  );
}

export function sendPasswordResetEmail(params: {
  address: string
  username: string,
  code: string
}) {
  send(
    [params.address],
    'Busybody password reset code',
    <>
      <p>Busybody received a password reset request for your account.</p>
      <p>Busybody username: {params.username}</p>
      <p>Temporary password reset code: {params.code}</p>
      <p style={{marginTop: "1em"}}>If you didn't request a password reset, you can ignore this message. The reset code
      will automatically expire after 1 hour.</p>
    </>
  )
}

export function sendPasswordResetAccountNotFoundEmail(email: string) {
  send(
    [email],
    'You do not have a Busybody account',
    <>
      <p>Busybody received a password reset request for your email address, {email}. However,
      there is no Busybody account associated with this address.</p>
      <p><a href={serverConfiguration.appUrl}>To create a new Busybody account,
      visit {serverConfiguration.appUrl}</a></p>
    </>
  )
}
