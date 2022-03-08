import { Box, Container, Tab, Tabs } from '@mui/material';
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
