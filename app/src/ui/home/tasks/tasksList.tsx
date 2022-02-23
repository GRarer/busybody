import { FriendInfo, getTodoListEndpoint, OwnTaskInfo } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet } from '../../../api/requests';
import { errorToMessage } from '../../../util/util';
import { SortControls, SortControlState } from './sortControls';
import { WatchedTaskListSkeleton } from './tasksListSkeleton';
import { TodoTaskCard } from './todoTaskCard';

type TaskSortKeys = 'date' | 'title' | 'watchers';

function sortWatchedTasks(
  tasks: OwnTaskInfo[], mode: TaskSortKeys, ascending: boolean
): OwnTaskInfo[] {
  const copy = tasks.map(t => t);

  const methods: Record<
  TaskSortKeys,
  (a: OwnTaskInfo, b: OwnTaskInfo) => number
  > = {
    'date': (a, b) => a.dueDate - b.dueDate,
    'title': (a, b) => a.title.localeCompare(b.title),
    'watchers': (a, b) => a.watchers.length - b.watchers.length,
  };
  const method = methods[mode];

  copy.sort(ascending ? (a, b) => method(a, b) : (a, b) => (-1 * method(a, b)));
  return copy;
}

export function TasksList(props: {
  token: string;
}): JSX.Element {

  const { enqueueSnackbar } = useSnackbar();

  const [listData, setListData] = useState<{friends: FriendInfo[]; tasks: OwnTaskInfo[];} | null>(null);
  const [sortState, setSortState] = useState<SortControlState<TaskSortKeys>>({ field: 'date', ascending: true });

  useEffect(() => {
    if (listData === null) {
      apiGet(getTodoListEndpoint, {}, props.token)
        .then(data => {
          console.log(data); // TODO remove
          setListData({
            friends: data.friends,
            tasks: sortWatchedTasks(data.tasks, sortState.field, sortState.ascending)
          });
        })
        .catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
        });
    }
  }, [listData, props.token]);

  function updateSortMode(mode: SortControlState<TaskSortKeys>): void {
    setSortState(mode);
    if (listData !== null) {
      const sorted = sortWatchedTasks(listData.tasks, mode.field, mode.ascending);
      setListData({ friends: listData.friends, tasks: sorted });
    }
  }

  if (listData === null) {
    return <WatchedTaskListSkeleton/>; // TODO use different skeleton page for todo list
  }

  return (<>
    <SortControls options={[
      { key: 'date', label: 'Due Date' },
      { key: 'title', label: 'Task Name' },
      { key: 'watchers', label: 'Watchers' }
    ]} mode={sortState} onChange={(state: SortControlState<TaskSortKeys>) => updateSortMode(state)}/>
    {listData.tasks.map(t => <TodoTaskCard info={t} key={t.taskId}/>)}
  </>);
}

