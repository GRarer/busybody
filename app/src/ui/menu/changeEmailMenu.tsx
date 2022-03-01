import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel,
  LinearProgress
} from '@mui/material';
import { selfInfoEndpoint, updateEmailEndpoint } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../../util/requests';
import { errorToMessage } from '../../util/util';

export function ChangeEmailDialog(
  props: {
    token: string;
    open: boolean;
    onClose: () => void;
  }
): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();

  const [loadedCurrent, setLoadedCurrent] = useState(false);

  const [email, setEmail] = useState('');
  useEffect(() => {
    // get info
    if (props.open) {
      if (!loadedCurrent) {
        apiGet(selfInfoEndpoint, {}, props.token).then(info => {
          setEmail(info.email);
          setLoadedCurrent(true);
        }).catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
          props.onClose();
        });
      }
    } else {
      setLoadedCurrent(false);
    }
  }, [props.open, props.token, loadedCurrent]);



  const canUpdate = Boolean(email);

  function update(): void {
    apiPut(updateEmailEndpoint, email, {}, props.token)
      .then(() => {
        enqueueSnackbar(`Your email address has been updated to ${email}`, { variant: 'success' });
        props.onClose();
      })
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Change Email Address</DialogTitle>
      {props.open && !loadedCurrent
        ? <LinearProgress />
        : <>
          <DialogContent>
            <FormControl variant="filled" fullWidth >
              <InputLabel htmlFor="email-input">Email address</InputLabel>
              <FilledInput id="email-input" value={email} onChange={ev => { setEmail(ev.target.value); }} />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={update} disabled={!canUpdate}>Update</Button>
          </DialogActions>
        </>}
    </Dialog>
  );

}
