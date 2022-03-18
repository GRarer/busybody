import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

export function InfoDialog(props: React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title: string;
}>): JSX.Element {
  return <Dialog
    open={props.open}
    onClose={() => props.onClose()}
    maxWidth='lg'
  >
    <DialogTitle>{props.title}</DialogTitle>
    <DialogContent>
      {props.children}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => props.onClose()}>Close</Button>

    </DialogActions>
  </Dialog>;
}
