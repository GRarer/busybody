import { LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel,
  ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FriendInfo, OwnTaskInfo, TodoListResponse, updateTaskEndpoint, UpdateTaskRequest } from 'busybody-core';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { apiPut } from '../../../api/requests';
import { dateFormatString, dateToUnixSeconds, unixSecondsToDate } from '../../../util/dates';
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
  task: OwnTaskInfo;
  friendsList: FriendInfo[];
}
): JSX.Element {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const [dueDate, setDueDate] = useState<Date | null>(unixSecondsToDate(props.task.dueDate));
  const [watchers, setWatchers] = useState(props.task.watchers);

  const [addWatcherMenuAnchorEl, setAddWatcherMenuAnchorEl] = useState<HTMLElement | null>(null);

  const assignedWatchersUUIDs = new Set(watchers.map(w => w.uuid));
  const unassignedFriends = props.friendsList.filter(f => !assignedWatchersUUIDs.has(f.uuid));


  const canSave = Boolean(title && (dueDate !== null));

  // closes dialog and resets state
  function resetAndClose(): void {
    props.onClose();
    setTitle(props.task.title);
    setDescription(props.task.description);
    setDueDate(unixSecondsToDate(props.task.dueDate));
    setWatchers(props.task.watchers);
  }

  function save(): void {
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
        resetAndClose();
      }
      ).catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }

  function removeWatcher(watcher: FriendInfo): void {
    setWatchers(watchers.filter(w => w.uuid !== watcher.uuid));
  }

  function addWatcher(watcher: FriendInfo): void {
    setWatchers([...watchers, watcher]);
  }

  return <>
    <Dialog open={props.open} onClose={resetAndClose} fullScreen={fullScreen} maxWidth='lg'>
      <DialogTitle>Edit Task</DialogTitle>
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
        <ListItemIcon><FriendAvatar info={f} size={30}/></ListItemIcon>
        <ListItemText>{f.fullName}</ListItemText>
      </MenuItem>)}
    </Menu>
  </>;
}
