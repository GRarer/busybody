import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { RegisterForm } from './Register';
import { SignInForm } from './SignIn';

export function LandingPage(props: {
  setSessionToken: (token: string) => void;
}): JSX.Element {

  const [showSignUp, setShowSignUp] = useState(0);

  return <>
    <Container maxWidth="sm">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '10px' }}>
        <Typography variant='body1' sx={{ marginTop: 1 }}>Busybody is a social to-do list app that emails your friends
        to hold you accountable if you don&apos;t complete your tasks on time.
        </Typography>
        <Tabs value={showSignUp} onChange={(ev, newValue) => setShowSignUp(newValue)} aria-label="basic tabs example">
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
      </Box>
      {showSignUp
        ? <RegisterForm/>
        : <SignInForm onSignIn={props.setSessionToken} />
      }
    </Container>
  </>;
}
