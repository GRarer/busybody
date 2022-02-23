import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@mui/material';
import { deleteTaskEndpoint, OwnTaskInfo, TodoListResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiDelete } from '../../../api/requests';
import { errorToMessage } from '../../../util/util';
import { ConfirmDialog } from '../../common/confirmDialog';
import { DueDate } from './dueDate';

export function TodoTaskCard(props: {
  info: OwnTaskInfo;
  token: string;
  updateList: (data: TodoListResponse) => void;
}): JSX.Element {

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  function deleteTask(): void {
    setShowRemoveDialog(false);
    apiDelete(deleteTaskEndpoint, { task_id: props.info.taskId }, props.token).then(newData => {
      props.updateList(newData);
      enqueueSnackbar('Task Removed', { variant: 'success' });
    }).catch(error => {
      enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
    });
  }

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
        <Button size="small" onClick={() => setShowRemoveDialog(true)}>Complete</Button>
        <Button size="small">Edit</Button>
      </CardActions>
    </Card>
    <ConfirmDialog
      title='Complete task'
      body = {<>Marking the task <strong>{props.info.title}</strong> as complete will remove it from your
      to-do list.</>}
      open={showRemoveDialog}
      onClose={() => setShowRemoveDialog(false)}
    >
      <Button size="small" onClick={() => deleteTask()}>Complete Task</Button>
    </ConfirmDialog>
  </>;
  // TODO implement editor dialog
  // TODO implement completion
  // TODO show watchers' icons on card
}
