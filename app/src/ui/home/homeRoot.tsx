import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { HomeInfo } from './homeInfo';


export function HomeRoot(props: {
  token: string;
  onLogOut: () => void;
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
      <p>This is the placeholder home page</p>
      <HomeInfo token={props.token} onLogOut={props.onLogOut}/>
    </Container>
  </>;
}
