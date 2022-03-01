import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, FormControlLabel, FormGroup,
  InputLabel, Switch
} from '@mui/material';
import { passwordRequirementProblem, updatePasswordEndpoint } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiPut } from '../../util/requests';
import { errorToMessage } from '../../util/util';
import { OptionalInputWarning } from '../common';

export function ChangePasswordDialog(
  props: {
    token: string;
    open: boolean;
    onClose: () => void;
  }
): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordProblem = password && passwordRequirementProblem(password);
  const passwordInputType = showPassword ? undefined : 'password';
  const passwordMismatchMessage =
    ((password !== passwordConfirm) && (passwordConfirm !== ''))
      ? "Those passwords don't match"
      : undefined;

  const canUpdate = Boolean(password && (password === passwordConfirm) && !passwordProblem);

  function resetAndClose(): void {
    props.onClose();
    setPassword('');
    setPasswordConfirm('');
    setShowPassword(false);
  }

  function update(): void {
    apiPut(updatePasswordEndpoint, password, {}, props.token)
      .then(() => {
        enqueueSnackbar('Your password has been updated', { variant: 'success' });
        resetAndClose();
      })
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }

  return (
    <Dialog open={props.open} onClose={() => resetAndClose()}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <FormControl variant="filled" style={{ width: '100%' }} error={Boolean(passwordProblem)}>
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <FilledInput id="password-input" value={password} type={passwordInputType}
            onChange={ev => { setPassword(ev.target.value); }} />
          <OptionalInputWarning message={passwordProblem} />
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }} error={Boolean(passwordMismatchMessage)}>
          <InputLabel htmlFor="password-confirm-input">Confirm Password</InputLabel>
          <FilledInput id="password-confirm-input" value={passwordConfirm} type={passwordInputType}
            onChange={ev => { setPasswordConfirm(ev.target.value); }} />
          <OptionalInputWarning message={passwordMismatchMessage} />
        </FormControl>
        <FormGroup>
          <FormControlLabel control={<Switch
            checked={showPassword}
            onChange={(ev, newValue) => setShowPassword(newValue)}
          />} label="Show Password" />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => resetAndClose()}>Cancel</Button>
        <Button onClick={update} disabled={!canUpdate}>Change Password</Button>
      </DialogActions>
    </Dialog>
  );

}
