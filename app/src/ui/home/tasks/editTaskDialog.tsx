import { LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel,
  ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { createTaskEndpoint, CreateTaskRequest, FriendInfo, OwnTaskInfo, TodoListResponse, updateTaskEndpoint,
  UpdateTaskRequest, dateToUnixSeconds, getNextWeek, unixSecondsToDate, dateFormatString } from 'busybody-core';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { apiPost, apiPut } from '../../../util/requests';
import { errorToMessage } from '../../../util/util';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FriendAvatar } from '../friends/friendCard';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import React from 'react';

export function EditTaskDialog(props: {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: TodoListResponse) => void;
  token: string;
  task: OwnTaskInfo | null; // set to null for creating a new task
  friendsList: FriendInfo[];
}
): JSX.Element {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { enqueueSnackbar } = useSnackbar();

  const defaults: {
    title: string;
    description: string;
    dueDate: number;
    watchers: FriendInfo[];
  } = props.task ?? {
    title: '',
    description: '',
    dueDate: dateToUnixSeconds(getNextWeek()),
    watchers: []
  };

  const [title, setTitle] = useState(defaults.title);
  const [description, setDescription] = useState(defaults.description);
  const [dueDate, setDueDate] = useState<Date | null>(unixSecondsToDate(defaults.dueDate));
  const [watchers, setWatchers] = useState(defaults.watchers);

  const [addWatcherMenuAnchorEl, setAddWatcherMenuAnchorEl] = useState<HTMLElement | null>(null);

  function resetToDefaults(): void {
    setTitle(defaults.title);
    setDescription(defaults.description);
    setDueDate(unixSecondsToDate(defaults.dueDate));
    setWatchers(defaults.watchers);
  }

  // ensures that fields are always reset whenever props are changed
  useEffect(() => {
    resetToDefaults();
  }, [props.task]);

  const assignedWatchersUUIDs = new Set(watchers.map(w => w.uuid));
  const unassignedFriends = props.friendsList.filter(f => !assignedWatchersUUIDs.has(f.uuid));


  const canSave = Boolean(title && (dueDate !== null));

  // closes dialog and resets state
  function resetAndClose(): void {
    props.onClose();
    resetToDefaults();
  }

  function save(): void {
    if (props.task === null) {
      const request: CreateTaskRequest = {
        title,
        description,
        dueDate: dateToUnixSeconds(dueDate!),
        watcherUUIDs: watchers.map(w => w.uuid)
      };
      apiPost(createTaskEndpoint, request, {}, props.token)
        .then(newData => {
          props.onUpdate(newData);
          props.onClose();
        }).catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
        });
    } else {
      // update existing task
      const updated: UpdateTaskRequest = {
        taskId: props.task.taskId,
        title: title,
        description: description,
        dueDate: dateToUnixSeconds(dueDate!),
        watcherUUIDs: watchers.map(w => w.uuid)
      };

      apiPut(updateTaskEndpoint, updated, {}, props.token)
        .then(newData => {
          props.onUpdate(newData);
          props.onClose();
        }).catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
        });
    }
  }

  function removeWatcher(watcher: FriendInfo): void {
    setWatchers(watchers.filter(w => w.uuid !== watcher.uuid));
  }

  function addWatcher(watcher: FriendInfo): void {
    setWatchers([...watchers, watcher]);
  }

  const dialogTitle = props.task === null ? 'Add Task' : 'Edit task';

  return <>
    <Dialog open={props.open} onClose={resetAndClose} fullScreen={fullScreen} maxWidth='lg'>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <FormControl variant="filled" fullWidth>
          <InputLabel htmlFor="title-input">Title</InputLabel>
          <FilledInput id="title-input" value={title} onChange={ev => { setTitle(ev.target.value); }} />
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }}>
          <InputLabel htmlFor="full-name">Description (Optional)</InputLabel>
          <FilledInput id="full-name" value={description}
            onChange={ev => { setDescription(ev.target.value); }} multiline />
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ marginTop: '10px' }}>
            <MobileDateTimePicker
              label="Due Date"
              value={dueDate}
              onChange={v => setDueDate(v)}
              renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
              inputFormat={dateFormatString}
            />
          </Box>
          {watchers.length === 0 ? <></> : <>
            <Typography>Watchers:</Typography>
            {watchers.map(w => <Box key={w.uuid} sx={{ paddingTop: '2px', paddingBottom: '3px' }}>
              <Chip variant="outlined" avatar={FriendAvatar({ info: w })} label={w.fullName}
                onDelete={() => removeWatcher(w)} />
            </Box>)}
          </>}
          {unassignedFriends.length === 0 ? <></> : <>
            <Button endIcon={<PersonAddAlt1Icon />}
              onClick={event => setAddWatcherMenuAnchorEl(event.currentTarget)}
            >Add Watcher</Button>
          </>}
          <Typography variant='body2' sx={{ opacity: '65%' }}>Users attached to this task as watchers will be
          notified by email if this task becomes overdue</Typography>

        </LocalizationProvider>

      </DialogContent>
      <DialogActions>
        <Button onClick={resetAndClose}>Cancel</Button>
        <Button disabled={!canSave} onClick={() => save()}>Save Changes</Button>
      </DialogActions>
    </Dialog>
    <Menu
      anchorEl={addWatcherMenuAnchorEl}
      open={addWatcherMenuAnchorEl !== null}
      onClose={() => setAddWatcherMenuAnchorEl(null)}
      onClick={() => setAddWatcherMenuAnchorEl(null)}
    >
      {unassignedFriends.map(f => <MenuItem key={f.uuid} onClick={() => addWatcher(f)}>
        <ListItemIcon><FriendAvatar info={f} size={30} /></ListItemIcon>
        <ListItemText>{f.fullName}</ListItemText>
      </MenuItem>)}
    </Menu>
  </>;
}
