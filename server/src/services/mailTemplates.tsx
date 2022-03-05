import React from 'react';
import { serverConfiguration } from '../util/config.js';

export function WatcherEmailBody(props: {
  taskTitle: string;
  taskDescription: string;
  ownerFullName: string;
  ownerNickname: string;
}): JSX.Element {
  // TODO include link to open this task's details
  // TODO improve style
  return <>
    <p>Your friend, <strong>{props.ownerFullName}</strong>, is overdue on one of their tasks.</p>
    <p>Task: {props.taskTitle}</p>
    {props.taskDescription === ''
      ? <></>
      : <p>Description: {props.taskDescription}</p>
    }
    <p style={{ marginTop: '20px', 'opacity': 0.5 }}>You are receiving this message
    because {props.ownerNickname} attached you as a watcher for this task
    on <a href={serverConfiguration.appUrl}>Busybody</a>.</p>
  </>;
}
