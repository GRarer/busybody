import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FriendInfo, OwnTaskInfo, TodoListResponse, updateTaskEndpoint, UpdateTaskRequest } from "busybody-core";
import { useSnackbar } from "notistack";
import { ppid } from "process";
import { useState } from "react";
import { apiPut } from "../../../api/requests";
import { errorToMessage } from "../../../util/util";

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
  // TODO due date controls
  // TODO watcher controls

  const canSave = Boolean(title && description); // TODO more conditions

  function save(): void {
    const updated: UpdateTaskRequest = {
      taskId: props.task.taskId,
      title: title,
      description: description,
      dueDate: props.task.dueDate, // TODO allow setting due date,
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

  return <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen} maxWidth='md'>
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
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose}>Cancel</Button>
      <Button disabled={!canSave} onClick={() => save()}>Save Changes</Button>
    </DialogActions>
  </Dialog>;
}
