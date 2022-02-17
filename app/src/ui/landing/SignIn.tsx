import { Login } from '@mui/icons-material';
import { Button, FilledInput, FormControl, InputLabel } from '@mui/material';
import { Box } from '@mui/material';
import { loginEndpoint, LoginRequest } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiPost } from '../../api/requests';
import { errorToMessage } from '../../util/util';

export function SignInForm(props: {
  onSignIn: (token: string) => void;
}): JSX.Element {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const canSignIn = !!(username && password);

  const signIn = (): void => {
    const request: LoginRequest = { username, password };
    apiPost(loginEndpoint, request, {}, null)
      .then(props.onSignIn)
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  };

  const handleKeypress: React.KeyboardEventHandler<HTMLDivElement> = (ev): void => {
    if (ev.key === 'Enter' && canSignIn) {
      signIn();
    }
  };

  return (
    <Box>
      <Box sx={{ marginTop: '10px', marginBottom: '10px' }} onKeyPress={handleKeypress}>
        <FormControl variant="filled" style={{ width: '100%' }}>
          <InputLabel htmlFor="username-input">Username</InputLabel>
          <FilledInput id="username-input" value={username} onChange={ev => { setUsername(ev.target.value); }} />
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }}>
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <FilledInput id="password-input" value={password} type="password"
            onChange={ev => { setPassword(ev.target.value); }}/>
        </FormControl>
      </Box>
      <Button variant="outlined" startIcon={<Login />} onClick={signIn} disabled={!canSignIn}>
        Sign In
      </Button>
    </Box>
  );
}
