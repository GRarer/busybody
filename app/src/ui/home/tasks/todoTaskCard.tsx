import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@mui/material';
import { OwnTaskInfo } from 'busybody-core';
import React from 'react';
import { DueDate } from './dueDate';

export function TodoTaskCard(props: {
  info: OwnTaskInfo;
}): JSX.Element {

  return <>
    <Card elevation={4} sx={{ marginBottom: '10px' }}>
      <CardHeader sx={{ paddingBottom: '0' }}
        title={props.info.title}
        subheader={<DueDate unixSeconds={props.info.dueDate} overdue={props.info.overdue}/>}
      />
      <CardContent sx={{ paddingBottom: '0' }}>
        <Typography variant="body1">{props.info.description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Complete</Button>
        <Button size="small">Edit</Button>
      </CardActions>
    </Card>
  </>;
  // TODO implement editor dialog
  // TODO implement completion
  // TODO show watchers' icons on card
}
