import { Box, Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton, Typography } from '@mui/material';
import { getWatchedTasksEndpoint, unfollowTaskEndpoint, WatchedTasksResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiDelete, apiGet } from '../../../api/requests';
import { errorToMessage } from '../../../util/util';
import { FriendAvatar } from '../friends/friendCard';
import { TaskListSkeleton } from './tasksListSkeleton';

function WatchedTaskCard(props: {
  info: WatchedTasksResponse[0];
  unfollow: () => void
}): JSX.Element {

  const [showUnfollowConfirmation, setShowUnfollowConfirmation] = useState(false);

  return <>
    <Card elevation={4} sx={{ marginBottom: '10px' }}>
      <CardHeader sx={{ paddingBottom: '0' }}
        avatar={<FriendAvatar info={props.info.owner} />}
        title={props.info.title}
        subheader={props.info.owner.fullName}
      />
      <CardContent>
        <Typography variant="body1">{props.info.description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => setShowUnfollowConfirmation(true)}>Stop Watching</Button>
      </CardActions>
    </Card>
    <Dialog
      open={showUnfollowConfirmation}
      onClose={() => setShowUnfollowConfirmation(false)}
    >
      <DialogTitle>
        {`Stop watching this task?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {/* // TODO would be more natural to use friendly name here, would need to add to response*/}
          Do you want to stop watching the task <em>"{props.info.title}"</em> from {props.info.owner.fullName}? It
          will no longer  appear in your "watching" list and you will not be notified
          if {props.info.owner.fullName} misses the deadline.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowUnfollowConfirmation(false)}>Cancel</Button>
        <Button onClick={() => {
          props.unfollow();
        }}>
          Stop Watching
        </Button>
      </DialogActions>
    </Dialog>
  </>
}

export function WatchList(props: {
  token: string;
}): JSX.Element {

  const { enqueueSnackbar } = useSnackbar();

  const [watchedTasks, setWatchedTasks] = useState<WatchedTasksResponse | null>(null);

  useEffect(() => {
    if (watchedTasks === null) {
      apiGet(getWatchedTasksEndpoint, {}, props.token)
        .then(data => {
          setWatchedTasks(data);
          console.log(data); // TODO Remove
        })
        .catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
        });
    }
  }, [watchedTasks, props.token]);

  const unfollowTask = (taskId: string): void => {
    apiDelete(unfollowTaskEndpoint, {task_id: taskId}, props.token)
      .then(data => setWatchedTasks(data))
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }

  if (watchedTasks === null) {
    return <TaskListSkeleton />;
  }

  return (<>
  {/* // TODO sort controls */}
  {watchedTasks.map(task =>
    <WatchedTaskCard info={task} key={task.taskId} unfollow={() => unfollowTask(task.taskId)}/>
  )}
  </>);
}
