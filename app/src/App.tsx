import { AppBar, Box, LinearProgress, Toolbar, Typography } from '@mui/material';
import { sessionActiveEndpoint } from 'busybody-core';
import React, { useEffect, useState } from 'react';
import { apiGet } from './api/requests';
import { HomeRoot } from './ui/home/homeRoot';
import { LandingPage } from './ui/landing/Landing';
import { SettingsMenu } from './ui/menu/settingsMenu';
import { saveToken } from './util/persistence';

function App(
  props: {
    initialSavedToken: string | null;
  }
): JSX.Element {
  // uncheckedSavedToken is true if we are using a token read from local storage
  // and have not yet checked it with the server to make sure it's still valid
  const [state, setState] = useState<{ token: string | null; uncheckedSavedToken: boolean; }>({
    token: props.initialSavedToken,
    uncheckedSavedToken: props.initialSavedToken !== null
  });

  const setToken = (token: string | null): void => {
    setState({ token, uncheckedSavedToken: false });
  };

  // when using a saved token from local storage, we need to check with the server to make sure the session is valid
  useEffect(() => {
    if (state.uncheckedSavedToken) {
      apiGet(sessionActiveEndpoint, {}, state.token).then(sessionIsValid => {
        if (sessionIsValid) {
          setState({
            token: state.token,
            uncheckedSavedToken: false
          });
        } else {
          setToken(null);
        }
      }).catch(error => {
        setToken(null);
      });
    }
  }, [state.uncheckedSavedToken]);

  const changeSession = (token: string | null): void => {
    saveToken(token);
    setToken(token);
  };

  // show loading bar if we haven't yet validated the saved session
  if (state.uncheckedSavedToken) {
    return (<LinearProgress />);
  }

  return (<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Busybody
        </Typography>
        {state.token
          ? <SettingsMenu token={state.token} onLogOut={() => changeSession(null)} />
          : <></>
        }
      </Toolbar>
    </AppBar>
    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
      {state.token
        ? <HomeRoot token={state.token}/>
        : <LandingPage setSessionToken={changeSession} />}
    </Box>
  </Box>);


}

export default App;
