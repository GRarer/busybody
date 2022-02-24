import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@mui/material';
import { deleteTaskEndpoint, FriendInfo, OwnTaskInfo, TodoListResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiDelete } from '../../../api/requests';
import { errorToMessage } from '../../../util/util';
import { ConfirmDialog } from '../../common/confirmDialog';
import { DueDate } from './dueDate';
import { EditTaskDialog } from './editTaskDialog';

export function TodoTaskCard(props: {
  info: OwnTaskInfo;
  friendsList: FriendInfo[]
  token: string;
  updateList: (data: TodoListResponse) => void;
}): JSX.Element {

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
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
        subheader={<DueDate unixSeconds={props.info.dueDate}/>}
      />
      <CardContent sx={{ paddingBottom: '0' }}>
        <Typography variant="body1">{props.info.description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => setShowRemoveDialog(true)}>Complete</Button>
        <Button size="small" onClick={() => setShowEditDialog(true)}>Edit</Button>
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
    <EditTaskDialog open={showEditDialog} onClose={() => setShowEditDialog(false)}
      token={props.token} task={props.info} friendsList={props.friendsList}
      onUpdate={(newData) => props.updateList(newData)}/>
  </>;
  // TODO show watchers' icons on card
}
