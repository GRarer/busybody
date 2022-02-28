import { Button } from '@mui/material';
import { FriendInfo, getTodoListEndpoint, OwnTaskInfo, TodoListResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet } from '../../../api/requests';
import { errorToMessage } from '../../../util/util';
import { SortControls, SortControlState } from './sortControls';
import { WatchedTaskListSkeleton } from './tasksListSkeleton';
import { TodoTaskCard } from './todoTaskCard';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { EditTaskDialog } from './editTaskDialog';

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

  const [listData, setListData] = useState<{ friends: FriendInfo[]; tasks: OwnTaskInfo[]; } | null>(null);
  const [sortState, setSortState] = useState<SortControlState<TaskSortKeys>>({ field: 'date', ascending: true });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  function updateList(data: TodoListResponse): void {
    setListData({
      friends: data.friends,
      tasks: sortWatchedTasks(data.tasks, sortState.field, sortState.ascending)
    });
  }

  useEffect(() => {
    if (listData === null) {
      apiGet(getTodoListEndpoint, {}, props.token)
        .then(data => {
          updateList(data);
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
    return <WatchedTaskListSkeleton />; // TODO use different skeleton page for todo list
  }

  return (<>
    <SortControls options={[
      { key: 'date', label: 'Due Date' },
      { key: 'title', label: 'Task Name' },
      { key: 'watchers', label: 'Watchers' }
    ]} mode={sortState} onChange={(state: SortControlState<TaskSortKeys>) => updateSortMode(state)} />
    <Button startIcon={<AddTaskIcon/>} fullWidth size="large"
      onClick={() => setShowCreateDialog(true)}>Add Task</Button>
    {listData.tasks.map(t => <TodoTaskCard
      info={t} key={t.taskId} token={props.token} friendsList={listData.friends}
      updateList={(data) => updateList(data)}
    />)}
    <EditTaskDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}
      onUpdate={data => updateList(data)} token={props.token} task={null} friendsList={listData.friends}/>
  </>);
}

