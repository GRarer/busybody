import React from 'react';
import { serverConfiguration } from '../../util/config.js';

function linkURL(goTo?: "friends" | "watching"): string {
  if (goTo === undefined) {
    return serverConfiguration.appUrl;
  }
  const url = new URL(serverConfiguration.appUrl);
  url.search = `?go=${goTo}`;
  return url.toString();
}

export function WatcherEmailBody(props: {
  taskTitle: string;
  taskDescription: string;
  ownerFullName: string;
  ownerNickname: string;
}): JSX.Element {
  return <>
    <p>Your friend, <strong>{props.ownerFullName}</strong>, is overdue on one of their tasks.</p>
    <p>Task: {props.taskTitle}</p>
    {props.taskDescription === ''
      ? <></>
      : <p>Description: {props.taskDescription}</p>
    }
    <a href={linkURL("watching")}>View Watched Tasks</a>
    <p style={{ marginTop: '20px', 'opacity': 0.5 }}>You are receiving this message
      because {props.ownerNickname} attached you as a watcher for this task
      on <a href={serverConfiguration.appUrl}>Busybody</a>.</p>
  </>;
}

export function FriendRequestEmailBody(props: {
  senderName: string
}): JSX.Element {

  return <>
    <p><strong>{props.senderName}</strong> sent you a friend request on Busybody.</p>
    <a href={linkURL("friends")}>View Friend Request</a>
  </>;
}

