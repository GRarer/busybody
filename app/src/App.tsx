import { AppBar, Box, LinearProgress, Paper, Toolbar, Typography } from '@mui/material';
import { sessionActiveEndpoint } from 'busybody-core';
import React, { useEffect, useState } from 'react';
import { apiGet } from './util/requests';
import { HomeRoot, TabName } from './ui/home/homeRoot';
import { LandingPage } from './ui/landing/Landing';
import { SettingsMenu } from './ui/menu/settingsMenu';
import { saveToken } from './util/persistence';

// get page-specific link from url search parameters
const goTo = new URLSearchParams(window.location.search).get('go');
console.log("goTo", goTo);
// remove query parameters
window.history.replaceState({}, document.title, window.location.href.split('?')[0]);

function App(
  props: {
    initialSavedToken: string | null;
    changeTheme: (mode: 'light' | 'dark') => void;
    currentThemeMode: 'light' | 'dark';
  }
): JSX.Element {
  // uncheckedSavedToken is true if we are using a token read from local storage
  // and have not yet checked it with the server to make sure it's still valid
  const [loginState, setLoginState] = useState<{ token: string | null; uncheckedSavedToken: boolean; }>({
    token: props.initialSavedToken,
    uncheckedSavedToken: props.initialSavedToken !== null
  });

  const [defaultTabOverride, setDefaultTabOverride] = useState<TabName | undefined>(
    goTo === "friends" ? "friends" : undefined
  );
  console.log("defaultTabOverride", defaultTabOverride);

  const setToken = (token: string | null): void => {
    setLoginState({ token, uncheckedSavedToken: false });
  };

  // when using a saved token from local storage, we need to check with the server to make sure the session is valid
  useEffect(() => {
    if (loginState.uncheckedSavedToken) {
      apiGet(sessionActiveEndpoint, {}, loginState.token).then(sessionIsValid => {
        if (sessionIsValid) {
          setLoginState({
            token: loginState.token,
            uncheckedSavedToken: false
          });
        } else {
          setToken(null);
        }
      }).catch(error => {
        setToken(null);
      });
    }
  }, [loginState.uncheckedSavedToken]);

  const changeSession = (token: string | null): void => {
    saveToken(token);
    setToken(token);
  };

  // show loading bar if we haven't yet validated the saved session
  if (loginState.uncheckedSavedToken) {
    return (<LinearProgress />);
  }

  return (<Paper sx={{ height: '100vh', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Busybody
        </Typography>
        {loginState.token
          ? <SettingsMenu token={loginState.token} onLogOut={() => {
            setDefaultTabOverride(undefined);
            changeSession(null);
          }}
            changeTheme={props.changeTheme} currentThemeMode={props.currentThemeMode} />
          : <></>
        }
      </Toolbar>
    </AppBar>
    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
      {loginState.token
        ? <HomeRoot token={loginState.token} initialTab={defaultTabOverride}/>
        : <LandingPage setSessionToken={changeSession} />}
    </Box>
  </Paper>);


}

export default App;
