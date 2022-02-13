import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { SignInForm } from './SignIn';

export function LandingPage(props: {
  setSessionToken: (token: string) => void;
}): JSX.Element {
  return <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
                Busybody
        </Typography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="sm">
      <SignInForm onSignIn={props.setSessionToken}></SignInForm>
    </Container>
  </>;
}
