import { LockReset } from '@mui/icons-material';
import {
  Box,
  Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, FormControlLabel, FormGroup,
  InputLabel, Switch, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { passwordRequirementProblem, resetPasswordEndpoint, resetPasswordRequestEndpoint, updatePasswordEndpoint } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiPost, apiPut } from '../../util/requests';
import { absurd, errorToMessage } from '../../util/util';
import { OptionalInputWarning } from '../common';

export function ResetPasswordDialog(
  props: {
    open: boolean;
    onClose: () => void;
    onSignIn: (token: string) => void;
  }
): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [step, setStep] = useState<"email" | "wait" | "password">("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function resetAndClose(): void {
    props.onClose();
  }

  function requestReset(): void {
    setStep("wait");
    apiPost(resetPasswordRequestEndpoint, {email}, {}, null).then(() => {
      setStep("password");
    }).catch(error => {
      enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      setEmail("");
      setStep("email");
    });
  }

  function resetPassword(): void {
    apiPut(resetPasswordEndpoint, {email, resetCode, newPassword}, {}, null)
      .then(token => {
        enqueueSnackbar("Password Updated", { variant: 'success' });
        props.onSignIn(token);
      })
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }

  let contents: JSX.Element;
  if (step === "email") {
    contents = <>
      <FormControl variant="filled" fullWidth >
        <InputLabel htmlFor="email-input">Email address</InputLabel>
        <FilledInput id="email-input" value={email} onChange={ev => { setEmail(ev.target.value); }} />
      </FormControl>
      <Button variant="outlined" startIcon={<LockReset />} onClick={requestReset} disabled={!email}
      sx={{marginTop: 1}}>
        Request Password Reset
      </Button>
    </>
  } else if (step === "wait") {
    contents = <Box sx={{ display: 'flex' }}>
      <CircularProgress sx={{margin: "auto", marginTop: 3}} size="70px"/>
    </Box>
  } else if (step === "password") {
    const passwordProblem = newPassword && passwordRequirementProblem(newPassword);
    const passwordInputType = showPassword ? undefined : 'password';
    const passwordMismatchMessage =
      ((newPassword !== newPasswordConfirm) && (newPasswordConfirm !== ''))
        ? "Those passwords don't match"
        : undefined;


    contents = <>
      <Typography sx={{marginBottom: 1}} variant="body1">A temporary reset code has been sent to {email}</Typography>
      <FormControl variant="filled" style={{ width: '100%' }} error={Boolean(passwordProblem)}>
          <InputLabel htmlFor="code-input">Password Reset Code</InputLabel>
          <FilledInput id="code-input" value={resetCode}
            onChange={ev => { setResetCode(ev.target.value); }} />
        </FormControl>
      <FormControl variant="filled" style={{ width: '100%' }} error={Boolean(passwordProblem)}>
          <InputLabel htmlFor="new-password-input">Password</InputLabel>
          <FilledInput id="new-password-input" value={newPassword} type={passwordInputType}
            onChange={ev => { setNewPassword(ev.target.value); }} />
          <OptionalInputWarning message={passwordProblem} />
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }} error={Boolean(passwordMismatchMessage)}>
          <InputLabel htmlFor="new-password-confirm-input">Confirm Password</InputLabel>
          <FilledInput id="new-password-confirm-input" value={newPasswordConfirm} type={passwordInputType}
            onChange={ev => { setNewPasswordConfirm(ev.target.value); }} />
          <OptionalInputWarning message={passwordMismatchMessage} />
        </FormControl>
        <FormGroup>
          <FormControlLabel control={<Switch
            checked={showPassword}
            onChange={(ev, newValue) => setShowPassword(newValue)}
          />} label="Show Password" />
        </FormGroup>
        <Button variant="outlined" startIcon={<LockReset />} onClick={resetPassword} disabled={!email}
          sx={{marginTop: 1}}>
            Reset Password
        </Button>
    </>
  } else {
    contents = absurd(step);
  }

  return (
    <Dialog open={props.open} onClose={() => resetAndClose()} fullScreen={fullScreen}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        {contents}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => resetAndClose()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

}
