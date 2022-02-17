import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel,
  LinearProgress
} from '@mui/material';
import { selfInfoEndpoint, updatePersonalInfoEndpoint, usernameRequirementProblem } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../../api/requests';
import { errorToMessage } from '../../util/util';
import { OptionalInputWarning } from '../common';

export function ChangePersonalInfoDialog(
  props: {
    token: string;
    open: boolean;
    onClose: () => void;
  }
): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();

  const [loadedCurrent, setLoadedCurrent] = useState(false);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    // get info
    if (props.open) {
      if (!loadedCurrent) {
        apiGet(selfInfoEndpoint, {}, props.token).then(info => {
          setUsername(info.username);
          setFullName(info.fullName);
          setNickname(info.nickname);
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



  const usernameProblem = username && usernameRequirementProblem(username);
  const canUpdate = username && fullName && nickname && Boolean(!usernameProblem);

  const update = (): void => {
    apiPut(updatePersonalInfoEndpoint, { username, fullName, nickname }, {}, props.token)
      .then(() => {
        enqueueSnackbar('Your info has been updated', { variant: 'success' });
        props.onClose();
      })
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Change Personal Info</DialogTitle>
      {props.open && !loadedCurrent
        ? <LinearProgress />
        : <>
          <DialogContent>
            <FormControl variant="filled" fullWidth error={Boolean(usernameProblem)}>
              <InputLabel htmlFor="username-input">Username</InputLabel>
              <FilledInput id="username-input" value={username} onChange={ev => { setUsername(ev.target.value); }} />
              <OptionalInputWarning message={usernameProblem} />
            </FormControl>
            <FormControl variant="filled" style={{ width: '100%' }}>
              <InputLabel htmlFor="full-name">Full Name</InputLabel>
              <FilledInput id="full-name" placeholder='George P. Burdell' value={fullName}
                onChange={ev => { setFullName(ev.target.value); }} />
            </FormControl>
            <FormControl variant="filled" style={{ width: '100%' }}>
              <InputLabel htmlFor="nickname">Nickname</InputLabel>
              <FilledInput id="nickname" value={nickname} onChange={ev => { setNickname(ev.target.value); }} />
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
