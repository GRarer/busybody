import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@mui/material';
import { WatchedTasksResponse } from 'busybody-core';
import { useState } from 'react';
import { FriendAvatar } from '../friends/friendCard';
import React from 'react';
import { DueDate } from './dueDate';
import { ConfirmDialog } from '../../common/confirmDialog';

export function WatchedTaskCard(props: {
  info: WatchedTasksResponse[0];
  unfollow: () => void;
}): JSX.Element {

  const [showUnfollowConfirmation, setShowUnfollowConfirmation] = useState(false);

  return <>
    <Card elevation={4} sx={{ marginBottom: '10px' }}>
      <CardHeader sx={{ paddingBottom: '0' }}
        avatar={<FriendAvatar info={props.info.owner} />}
        title={props.info.title}
        subheader={props.info.owner.fullName}
      />
      <CardContent sx={{ paddingBottom: '0' }}>
        <Typography variant="body1">{props.info.description}</Typography>
        <DueDate unixSeconds={props.info.dueDate} overdue={props.info.overdue}/>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => setShowUnfollowConfirmation(true)}>Stop Watching</Button>
      </CardActions>
    </Card>
    <ConfirmDialog open={showUnfollowConfirmation} onClose={() => setShowUnfollowConfirmation(false)}
      title={'Stop watching this task?'}
      body={/* // TODO would be more natural to use friendly name here, would need to add to response */
    `Do you want to stop watching the task <strong>"${props.info.title}";</strong> from <strong>
    ${props.info.owner.fullName}</strong>? It will no longer appear in your "watching" list
    and you will not be notified if ${props.info.owner.fullName} misses the deadline.`}>
      <Button onClick={() => {
        props.unfollow();
      }}>
          Stop Watching
      </Button>
    </ConfirmDialog>
  </>;
}
