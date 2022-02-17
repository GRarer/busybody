import { Check } from '@mui/icons-material';
import {
  Button, FilledInput, FormControl, FormControlLabel, FormGroup, InputLabel,
  Switch } from '@mui/material';
import { Box } from '@mui/material';
import { passwordRequirementProblem, registrationEndpoint, RegistrationRequest,
  usernameRequirementProblem } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiPut } from '../../api/requests';
import { errorToMessage } from '../../util/util';
import { OptionalInputWarning } from '../common';

export function RegisterForm(props: {
  onSignIn: (token: string) => void;
}): JSX.Element {

  // TODO remove default values
  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const { enqueueSnackbar } = useSnackbar();


  const usernameProblem = username && usernameRequirementProblem(username);
  const passwordProblem = password && passwordRequirementProblem(password);
  const passwordInputType = showPassword ? undefined : 'password';
  const passwordMismatchMessage =
    ((password !== passwordConfirm) && (passwordConfirm !== ''))
      ? "Those passwords don't match"
      : undefined;

  const canRegister
    = [username, password, fullName, nickname, email].every(x => x !== '')
    && (password === passwordConfirm)
    && !usernameProblem
    && !passwordProblem;

  const register = (): void => {
    const request: RegistrationRequest = { username, password, fullName, nickname, email };
    apiPut(registrationEndpoint, request, {}, null)
      .then(props.onSignIn)
      .catch(error => {
        const problem = errorToMessage(error);
        const variant = problem.code === 500 ? 'error' : 'warning';
        enqueueSnackbar(problem.message, { variant });
      });
  };

  const handleKeypress: React.KeyboardEventHandler<HTMLDivElement> = (ev): void => {
    if (ev.key === 'Enter' && canRegister) {
      register();
    }
  };


  return (
    <Box>
      <Box sx={{ marginTop: '10px', marginBottom: '10px' }} onKeyPress={handleKeypress}>
        <FormControl variant="filled" style={{ width: '100%' }} error={Boolean(usernameProblem)}>
          <InputLabel htmlFor="username-input">Username</InputLabel>
          <FilledInput id="username-input" value={username} onChange={ev => { setUsername(ev.target.value); }} />
          <OptionalInputWarning message={usernameProblem}/>
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }} error={Boolean(passwordProblem)}>
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <FilledInput id="password-input" value={password} type={passwordInputType}
            onChange={ev => { setPassword(ev.target.value); }} />
          <OptionalInputWarning message={passwordProblem}/>
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }} error={Boolean(passwordMismatchMessage)}>
          <InputLabel htmlFor="password-confirm-input">Confirm Password</InputLabel>
          <FilledInput id="password-confirm-input" value={passwordConfirm} type={passwordInputType}
            onChange={ev => { setPasswordConfirm(ev.target.value); }} />
          <OptionalInputWarning message={passwordMismatchMessage}/>
        </FormControl>
        <FormGroup>
          <FormControlLabel control={<Switch
            checked={showPassword}
            onChange={(ev, newValue) => setShowPassword(newValue)}
          />} label="Show Password" />
        </FormGroup>
        <FormControl variant="filled" style={{ width: '100%' }}>
          <InputLabel htmlFor="full-name">Full Name</InputLabel>
          <FilledInput id="full-name" placeholder='George P. Burdell' value={fullName}
            onChange={ev => { setFullName(ev.target.value); }} />
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }}>
          <InputLabel htmlFor="nickname">Nickname</InputLabel>
          <FilledInput id="nickname" value={nickname} onChange={ev => { setNickname(ev.target.value); }} />
        </FormControl>
        <FormControl variant="filled" style={{ width: '100%' }}>
          <InputLabel htmlFor="email-address">Email Address</InputLabel>
          <FilledInput id="email-address" value={email} onChange={ev => { setEmail(ev.target.value); }} />
        </FormControl>
      </Box>
      <Button variant="outlined" startIcon={<Check />} onClick={register} disabled={!canRegister}>
        Register
      </Button>
    </Box>
  );
}
