import { DateTimePicker, LocalizationProvider, MobileDateTimePicker } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel, LinearProgress, OutlinedInput, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FriendInfo, OwnTaskInfo, TodoListResponse, updateTaskEndpoint, UpdateTaskRequest } from "busybody-core";
import { useSnackbar } from "notistack";
import { ppid } from "process";
import { useState } from "react";
import { apiPut } from "../../../api/requests";
import { dateFormatString, dateToUnixSeconds, unixSecondsToDate } from "../../../util/dates";
import { errorToMessage } from "../../../util/util";
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export function EditTaskDialog(props: {
  open: boolean,
  onClose: () => void,
  onUpdate: (data: TodoListResponse) => void,
  token: string,
  task: OwnTaskInfo,
  friendsList: FriendInfo[]
}
): JSX.Element {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const [dueDate, setDueDate] = useState<Date | null>(unixSecondsToDate(props.task.dueDate));
  // TODO watcher controls

  const canSave = Boolean(title && description && (dueDate !== null)); // TODO more conditions

  function save(): void {
    const updated: UpdateTaskRequest = {
      taskId: props.task.taskId,
      title: title,
      description: description,
      dueDate: dateToUnixSeconds(dueDate!),
      watcherUUIDs: props.task.watchers.map(w => w.uuid) // TODO allow modifying watchers
    }

    apiPut(updateTaskEndpoint, updated, {}, props.token)
      .then(newData => {
        props.onUpdate(newData);
        props.onClose();
      }
      ).catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });

  }

  return <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen} maxWidth='lg'>
    <DialogTitle>Edit Task</DialogTitle>
    <DialogContent>


          <FormControl variant="filled" fullWidth>
            <InputLabel htmlFor="title-input">Title</InputLabel>
            <FilledInput id="title-input" value={title} onChange={ev => { setTitle(ev.target.value); }} />
          </FormControl>
          <FormControl variant="filled" style={{ width: '100%' }}>
            <InputLabel htmlFor="full-name">Description</InputLabel>
            <FilledInput id="full-name" value={description}
              onChange={ev => { setDescription(ev.target.value); }} multiline />
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{marginTop: '10px'}}>
            <MobileDateTimePicker
            label="Due Date"
            value={dueDate}
            onChange={v => setDueDate(v)}
            renderInput={(params) => <TextField {...params} sx={{width: '100%'}}/>}
            inputFormat={dateFormatString}
          />
            </Box>

          </LocalizationProvider>

    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose}>Cancel</Button>
      <Button disabled={!canSave} onClick={() => save()}>Save Changes</Button>
    </DialogActions>
  </Dialog>;
}
