import { Breakpoint, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle } from '@mui/material';
import React from 'react';

export function ConfirmDialog(props: React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title: string;
  body: string | JSX.Element;
  maxWidth?: Breakpoint;
}>): JSX.Element {

  const content = typeof props.body === 'string'
    ? <DialogContentText>{props.body}</DialogContentText>
    : props.body;

  return <Dialog
    open={props.open}
    onClose={() => props.onClose()}
    maxWidth={props.maxWidth}
  >
    <DialogTitle>{props.title}</DialogTitle>
    <DialogContent>
      {content}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => props.onClose()}>Cancel</Button>
      {props.children}
    </DialogActions>
  </Dialog>;
}
