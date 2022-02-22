import { getWatchedTasksEndpoint, unfollowTaskEndpoint, WatchedTasksResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiDelete, apiGet } from '../../../api/requests';
import { errorToMessage } from '../../../util/util';
import { FriendAvatar } from '../friends/friendCard';
import { TaskListSkeleton } from './tasksListSkeleton';
import { WatchedTaskCard } from './watchedTaskCard';

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
