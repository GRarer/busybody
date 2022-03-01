import React from 'react';

export function WatcherEmailBody(props: {
  taskTitle: string;
  ownerFullName: string;
  ownerNickname: string;
}): JSX.Element {
  // TODO include link to open this task's details
  // TODO improve style
  return <>
    <p>The task <strong>{props.taskTitle}</strong> from your friend, <strong>{props.ownerFullName}</strong> is
    overdue.</p>
    <p>You are receiving this message because {props.ownerNickname} attached you as a watcher for this task on
    Busybody.</p>
  </>;
}
