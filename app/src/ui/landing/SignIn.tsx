import { LockReset, Login } from '@mui/icons-material';
import { Button, FilledInput, FormControl, InputLabel } from '@mui/material';
import { Box } from '@mui/material';
import { loginEndpoint } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiPost } from '../../util/requests';
import { errorToMessage } from '../../util/util';
import { ResetPasswordDialog } from './ResetPasswordDialog';

export function SignInForm(props: {
  onSignIn: (token: string) => void;
}): JSX.Element {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const canSignIn = !!(username && password);

  function signIn(): void {
    apiPost(loginEndpoint, { username, password }, {}, null)
      .then(props.onSignIn)
      .catch(error => {
        const errorInfo = errorToMessage(error);
        enqueueSnackbar(errorInfo.message, { variant: 'error' });
        if (errorInfo.code === 403) {
          setForgotPasswordVisible(true);
        }
      });
  }

  const handleKeypress: React.KeyboardEventHandler<HTMLDivElement> = (ev): void => {
    if (ev.key === 'Enter' && canSignIn) {
      signIn();
    }
  };

  return (
    <>
      <Box>
        <Box sx={{ marginTop: '10px', marginBottom: '10px' }} onKeyPress={handleKeypress}>
          <FormControl variant="filled" style={{ width: '100%' }}>
            <InputLabel htmlFor="username-input">Username</InputLabel>
            <FilledInput id="username-input" value={username} onChange={ev => { setUsername(ev.target.value); }} />
          </FormControl>
          <FormControl variant="filled" style={{ width: '100%' }}>
            <InputLabel htmlFor="password-input">Password</InputLabel>
            <FilledInput id="password-input" value={password} type="password"
              onChange={ev => { setPassword(ev.target.value); }} />
          </FormControl>
        </Box>
        <span>
          <Button variant="outlined" startIcon={<Login />} onClick={signIn} disabled={!canSignIn}>
            Sign In
          </Button>
          {
            forgotPasswordVisible
              ? <Button variant="text" sx={{ marginLeft: 1 }} startIcon={<LockReset />}
                  onClick={() => setShowResetPasswordDialog(true)}>
                Forgot  Password
              </Button>
              : <></>
          }
        </span>
      </Box>
      <ResetPasswordDialog open={showResetPasswordDialog} onClose={() => setShowResetPasswordDialog(false)}
        onSignIn={props.onSignIn}/>
    </>
  );
}
