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
        <DueDate unixSeconds={props.info.dueDate}/>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => setShowUnfollowConfirmation(true)}>Stop Watching</Button>
      </CardActions>
    </Card>
    <ConfirmDialog open={showUnfollowConfirmation} onClose={() => setShowUnfollowConfirmation(false)}
      title={'Stop watching this task?'}
      body={<Typography>
        Do you want to stop watching the task <strong>{props.info.title};</strong> from <strong>
          {props.info.owner.fullName}</strong>? It will no longer appear in your &quot;watching&quot; list
        and you will not be notified if {props.info.owner.nickname} misses the deadline.`
      </Typography>
      }>
      <Button onClick={() => {
        props.unfollow();
      }}>
          Stop Watching
      </Button>
    </ConfirmDialog>
  </>;
}
