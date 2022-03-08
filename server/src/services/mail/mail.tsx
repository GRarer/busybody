import { serverConfiguration } from '../../util/config.js';
import { FriendRequestEmailBody, WatcherEmailBody } from './mailTemplates.js';
import ReactDOMServer from 'react-dom/server.js';
import { smtpTransport } from './smtpConfig.js';
import React from 'react';

// TODO some of these should be done synchronously and report if they can't be send

async function send(addresses: string[], subject: string, body: JSX.Element | string): Promise<void> {
  await smtpTransport.sendMail({
    from: serverConfiguration.emailFromField,
    to: addresses.join(', '),
    subject,
    html: typeof body === 'string' ? undefined : ReactDOMServer.renderToStaticMarkup(body),
    text: typeof body === 'string' ? body : undefined
  });
}

function sendWithoutWaiting(addresses: string[], subject: string, body: JSX.Element | string): void {
  send(addresses, subject, body).catch(err => {
    console.error('failed to send email');
    console.error(err);
  });
}

export async function sendPlaintextEmail(
  addresses: string[], subject: string = 'Hello', body: string = 'Hello world'
): Promise<void> {
  await send(addresses, subject, body);
}

// send watcher emails (and do not wait for transaction to be finished)
export function sendWatcherEmail(task: {
  watcherAddresses: string[];
  taskTitle: string;
  taskDescription: string;
  ownerNickname: string;
  ownerFullName: string;
}): void {
  sendWithoutWaiting(
    task.watcherAddresses,
    `${task.ownerNickname} missed their deadline for the task ${task.taskTitle}`,
    WatcherEmailBody(task)
  );
}

export function sendFriendRequestEmail(args: {
  senderName: string;
  recipientEmailAddress: string;
}): void {
  sendWithoutWaiting(
    [args.recipientEmailAddress],
    'new Busybody friend request',
    FriendRequestEmailBody({ senderName: args.senderName })
  );
}

export async function sendPasswordResetEmail(params: {
  address: string;
  username: string;
  code: string;
}): Promise<void> {
  await send(
    [params.address],
    'Busybody password reset code',
    <>
      <p>Busybody received a password reset request for your account.</p>
      <p>Busybody username: {params.username}</p>
      <p>Temporary password reset code: {params.code}</p>
      <p style={{ marginTop: '1em' }}>If you did not request a password reset, you can ignore this message. The reset
      code will automatically expire after 1 hour.</p>
    </>
  );
}

export async function sendPasswordResetAccountNotFoundEmail(email: string): Promise<void> {
  await send(
    [email],
    'You do not have a Busybody account',
    <>
      <p>Busybody received a password reset request for your email address, {email}. However,
      there is no Busybody account associated with this address.</p>
      <p><a href={serverConfiguration.appUrl}>To create a new Busybody account,
      visit {serverConfiguration.appUrl}</a></p>
    </>
  );
}

export async function sendEmailChangeVerificationEmail(email: string, code: string): Promise<void> {
  await send(
    [email],
    'Busybody email verification code',
    <>
      <p>To change the email associated with your Busybody account to {email}, enter the following
      verification code: {code}</p>
      <p style={{ marginTop: '1em' }}>If you did not request to change your email, you can ignore this message.
      The verification code will automatically expire after 1 hour.</p>
    </>
  );
}

export async function sendRegistrationVerificationEmail(params: {
  email: string;
  username: string;
  uuid: string;
  verificationCode: string;
}): Promise<void> {
  const link = serverConfiguration.appUrl + `?verify_account=${params.uuid}&code=${params.verificationCode}`;
  await send(
    [params.email],
    'Busybody registration verification',
    <>
      <p>To complete registration of your Busybody account ({params.username}), <a href={link}>click here</a></p>.
      <p>By registering your email address with Busybody, you agree to allow
      Busybody to send you email notifications. You may change the email address associated with your account or
      even close your account at any time.</p>
    </>
  );
}

export async function sendAccountRegistrationEmailCollisionEmail(params: {
  address: string;
  newUsername: string;
  existingUsername: string;
}): Promise<void> {
  await send(
    [params.address],
    'You already have a busybody account',
    <>
      <p>You or somebody else attempted to register a new Busybody account with the username {params.newUsername} using
      this email address ({params.address}). However, you already have a Busybody account associated with this address,
      with the username {params.existingUsername}.</p>
      <p>To log in to Busybody, visit <a href={serverConfiguration.appUrl}>{serverConfiguration.appUrl}</a></p>
    </>
  );
}
