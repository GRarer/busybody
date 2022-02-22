import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { ButtonGroup, Button, Box } from '@mui/material';
import { getWatchedTasksEndpoint, unfollowTaskEndpoint, WatchedTasksResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiDelete, apiGet } from '../../../api/requests';
import { errorToMessage } from '../../../util/util';
import { FriendAvatar } from '../friends/friendCard';
import { TaskListSkeleton } from './tasksListSkeleton';
import { WatchedTaskCard } from './watchedTaskCard';

type WatchedTaskSortState = {property: 'title' | 'date' | 'owner', ascending: boolean};

function sortTasks(tasks: WatchedTasksResponse, mode: WatchedTaskSortState): WatchedTasksResponse {
  const copy = tasks.map(t => t);

  const methods: Record<WatchedTaskSortState['property'],(a: WatchedTasksResponse[0], b: WatchedTasksResponse[0]) => number> = {
    'date': (a, b) => a.dueDate - b.dueDate,
    'owner': (a, b) => a.owner.fullName.localeCompare(b.owner.fullName),
    'title': (a, b) => a.title.localeCompare(b.title),
  };
  const method = methods[mode.property];

  copy.sort(mode.ascending ? (a,b) => method(a,b) : (a,b) => (-1 * method(a,b)));
  return copy;
}

export function WatchList(props: {
  token: string;
}): JSX.Element {

  const { enqueueSnackbar } = useSnackbar();

  const [watchedTasks, setWatchedTasks] = useState<WatchedTasksResponse | null>(null);
  const [sortState, setSortState] = useState<WatchedTaskSortState>({property: 'date', ascending: true})

  const changeSort = (property: WatchedTaskSortState['property']): void => {

    const next = property === sortState.property
      ? {property, ascending: !sortState.ascending}
      : {property, ascending: true};
    setSortState(next);
    if (watchedTasks!==null){
      setWatchedTasks(sortTasks(watchedTasks, next));
    }
  };

  useEffect(() => {
    if (watchedTasks === null) {
      apiGet(getWatchedTasksEndpoint, {}, props.token)
        .then(data => {
          setWatchedTasks(sortTasks(data, sortState));
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

  const getSortIcon = (label: WatchedTaskSortState['property']): JSX.Element | undefined => {
    if (label != sortState.property) {
      return undefined;
    }
    return sortState.ascending ? <ArrowUpward/> : <ArrowDownward/>;
  }

  if (watchedTasks === null) {
    return <TaskListSkeleton />;
  }

  return (<>
  {/* // TODO sort controls */}
  <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: '5px'}}>
    <ButtonGroup size="large">
        <Button endIcon={getSortIcon('title')} onClick={() => changeSort('title')}>Task Name</Button>
        <Button endIcon={getSortIcon('date')} onClick={() => changeSort('date')}>Due Date</Button>
        <Button endIcon={getSortIcon('owner')}onClick={() => changeSort('owner')}>User</Button>
    </ButtonGroup>
  </Box>
  {watchedTasks.map(task =>
    <WatchedTaskCard info={task} key={task.taskId} unfollow={() => unfollowTask(task.taskId)}/>
  )}
  </>);
}
