import { Typography } from '@mui/material';
import { getWatchedTasksEndpoint, unfollowTaskEndpoint, WatchedTasksResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiDelete, apiGet } from '../../../util/requests';
import { errorToMessage } from '../../../util/util';
import { SortControls, SortControlState } from './sortControls';
import { WatchedTaskListSkeleton } from './tasksListSkeleton';
import { WatchedTaskCard } from './watchedTaskCard';

type WatchedTaskSortKeys = 'date' | 'title' | 'owner';

function sortWatchedTasks(
  tasks: WatchedTasksResponse, mode: WatchedTaskSortKeys, ascending: boolean
): WatchedTasksResponse {
  const copy = tasks.map(t => t);

  const methods: Record<
  WatchedTaskSortKeys,
  (a: WatchedTasksResponse[0], b: WatchedTasksResponse[0]) => number
  > = {
    'date': (a, b) => a.dueDate - b.dueDate,
    'owner': (a, b) => a.owner.fullName.localeCompare(b.owner.fullName),
    'title': (a, b) => a.title.localeCompare(b.title),
  };
  const method = methods[mode];

  copy.sort(ascending ? (a, b) => method(a, b) : (a, b) => (-1 * method(a, b)));
  return copy;
}

export function WatchList(props: {
  token: string;
}): JSX.Element {

  const { enqueueSnackbar } = useSnackbar();

  const [watchedTasks, setWatchedTasks] = useState<WatchedTasksResponse | null>(null);
  const [sortState, setSortState] = useState<SortControlState<WatchedTaskSortKeys>>({ field: 'date', ascending: true });

  useEffect(() => {
    if (watchedTasks === null) {
      apiGet(getWatchedTasksEndpoint, {}, props.token)
        .then(data => {
          setWatchedTasks(sortWatchedTasks(data, sortState.field, sortState.ascending));
        })
        .catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
        });
    }
  }, [watchedTasks, props.token]);

  function unfollowTask(taskId: string): void {
    apiDelete(unfollowTaskEndpoint, { task_id: taskId }, props.token)
      .then(data => setWatchedTasks(data))
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }

  function updateSortMode(mode: SortControlState<WatchedTaskSortKeys>): void {
    setSortState(mode);
    if (watchedTasks !== null) {
      setWatchedTasks(sortWatchedTasks(watchedTasks, mode.field, mode.ascending));
    }
  }

  if (watchedTasks === null) {
    return <WatchedTaskListSkeleton />;
  }

  return (<>
    <SortControls options={[
      { key: 'date', label: 'Due Date' },
      { key: 'title', label: 'Task Name' },
      { key: 'owner', label: 'User' }
    ]} mode={sortState} onChange={(state: SortControlState<WatchedTaskSortKeys>) => updateSortMode(state)}/>
    {watchedTasks.map(task =>
      <WatchedTaskCard info={task} key={task.taskId} unfollow={() => unfollowTask(task.taskId)}/>
    )}

    {
      /* Placeholder text for when there are no watched tasks */
      watchedTasks.length > 0 ? <></> : <>
        <Typography variant='body1' sx={{ marginTop: '10px' }}>You currently have no watched tasks.</Typography>
        <Typography variant='body1' sx={{ marginTop: '10px' }}>When your friends attach you as a watcher to their tasks,
        those tasks will appear here, and you will be notified by email if those tasks are not completed on
        time.</Typography>
      </>
    }
  </>);
}
