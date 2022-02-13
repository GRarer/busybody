import { Button, Card, CardActions, CardContent, FilledInput, FormControl, InputLabel,
  Typography } from '@mui/material';
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
    apiPost(loginEndpoint, request, {})
      .then(props.onSignIn)
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  };

  return (
    <Card sx={{ minWidth: 275, marginTop: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Sign In
        </Typography>
        <FormControl variant="filled" style={{ width: '100%' }}>
          <InputLabel htmlFor="username-input">Username</InputLabel>
          <FilledInput id="username-input" value={username} onChange={ev => { setUsername(ev.target.value); }}/>
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }}>
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <FilledInput id="password-input" value={password} onChange={ev => { setPassword(ev.target.value); }}/>
        </FormControl>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={signIn} disabled={!canSignIn}>Sign In</Button>
      </CardActions>
    </Card>
  );
}
