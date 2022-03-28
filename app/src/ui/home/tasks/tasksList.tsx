import { Box, Button, Chip, useMediaQuery } from '@mui/material';
import { FriendInfo, getTodoListEndpoint, OwnTaskInfo, TodoListResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet } from '../../../util/requests';
import { errorToMessage } from '../../../util/util';
import { SortControls, SortControlState } from './sortControls';
import { TodoTaskListSkeleton } from './tasksListSkeleton';
import { TodoTaskCard } from './todoTaskCard';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { EditTaskDialog } from './editTaskDialog';

type TaskSortKeys = 'date' | 'title' | 'watchers';

const FILTER_SHOW_ALL = 'Show All';

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

  const smallWidth = useMediaQuery('(max-width: 800px)');
  const chipSize = smallWidth ? 'small' : undefined;

  const { enqueueSnackbar } = useSnackbar();

  const [listData, setListData]
    = useState<{ friends: FriendInfo[]; tasks: OwnTaskInfo[]; categoryOptions: string[];} | null>(null);
  const [sortState, setSortState] = useState<SortControlState<TaskSortKeys>>({ field: 'date', ascending: true });
  const [filterCategory, setFilterCategory] = useState<string>(FILTER_SHOW_ALL);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  function updateList(data: TodoListResponse): void {
    const categorySet = new Set<string>();
    for (const task of data.tasks) {
      categorySet.add(task.category);
    }
    const categoryOptions = Array.from(categorySet);
    categoryOptions.sort();

    setListData({
      friends: data.friends,
      tasks: sortWatchedTasks(data.tasks, sortState.field, sortState.ascending),
      categoryOptions
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
      setListData({ friends: listData.friends, tasks: sorted, categoryOptions: listData.categoryOptions });
    }
  }

  if (listData === null) {
    return <TodoTaskListSkeleton />;
  }

  const filteredTasks = (filterCategory === FILTER_SHOW_ALL)
    ? listData.tasks
    : listData.tasks.filter(t => t.category === filterCategory);

  function CategoryFilterChip(props: {option: string; overrideLabel?: string;}): JSX.Element {
    const opt = props.option;
    const selected = filterCategory === opt;
    return <Chip label={props.overrideLabel ?? opt} onClick={() => setFilterCategory(opt)}
      variant={selected ? 'filled' : 'outlined'} color={selected ? 'primary' : undefined}
      sx={{ margin: '2px' }} size={chipSize} />;
  }

  return (<>
    <SortControls options={[
      { key: 'date', label: 'Due Date' },
      { key: 'title', label: 'Task Name' },
      { key: 'watchers', label: 'Watchers' }
    ]} mode={sortState} onChange={(state: SortControlState<TaskSortKeys>) => updateSortMode(state)} />
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
      <CategoryFilterChip option={FILTER_SHOW_ALL} overrideLabel='Show All'/>
      {listData.categoryOptions.map(opt => <CategoryFilterChip option={opt} key={opt}/>)}
    </Box>
    <Button startIcon={<AddTaskIcon/>} fullWidth size="large"
      onClick={() => setShowCreateDialog(true)}>Add Task</Button>
    {filteredTasks.map(t => <TodoTaskCard
      info={t} key={t.taskId} token={props.token} friendsList={listData.friends}
      categoryOptions={listData.categoryOptions} updateList={(data) => updateList(data)}
    />)}
    <EditTaskDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}
      onUpdate={data => updateList(data)} token={props.token} task={null}
      friendsList={listData.friends} categoryOptions={listData.categoryOptions}/>
  </>);
}

