import { Container } from '@mui/material';
import React from 'react';
import { SignInForm } from './SignIn';

export function LandingPage(props: {
  setSessionToken: (token: string) => void;
}): JSX.Element {
  return <>
    <Container maxWidth="sm">
      <SignInForm onSignIn={props.setSessionToken}></SignInForm>
    </Container>
  </>;
}
