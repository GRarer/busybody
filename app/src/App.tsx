import { AppBar, Box, IconButton, LinearProgress, Paper, Toolbar, Typography } from '@mui/material';
import { serverOnlineEndpoint, sessionActiveEndpoint, verifyRegistrationEndpoint } from 'busybody-core';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from './util/requests';
import { HomeRoot, TabName } from './ui/home/homeRoot';
import { LandingPage } from './ui/landing/Landing';
import { LoggedOutMenu, SettingsMenu } from './ui/menu/settingsMenu';
import { saveToken } from './util/persistence';
import { Help, TaskAlt } from '@mui/icons-material';
import { Offline } from './ui/offline';
import { VerifyRegistrationFailed } from './ui/verifyRegistrationFailed';
import { errorToMessage } from './util/util';
import { InfoDialog } from './ui/common/infoDialog';
import { FAQ } from './ui/info';

// get page-specific link from url search parameters
const urlParams = new URLSearchParams(window.location.search);
const goTo = urlParams.get('go');
const verificationUUID = urlParams.get('verify_account');
const verificationCode = urlParams.get('code');

// remove query parameters for goto
if (goTo) {
  window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
}

type AppState
  = { state: 'logged_out'; }
  | { state: 'logged_in'; token: string; }
  | { state: 'unverified_saved_token'; token: string; }
  | { state: 'verify_registration'; verificationUUID: string; verificationCode: string; }
  | { state: 'verify_registration_failed'; errorMessage: string; }
  | { state: 'offline'; };

function App(
  props: {
    initialSavedToken: string | null;
    changeTheme: (mode: 'light' | 'dark') => void;
    currentThemeMode: 'light' | 'dark';
  }
): JSX.Element {

  let defaultState: AppState;
  if (verificationUUID && verificationCode) {
    defaultState = { state: 'verify_registration', verificationUUID, verificationCode };
  } else if (props.initialSavedToken !== null) {
    defaultState = { state: 'unverified_saved_token', token: props.initialSavedToken };
  } else {
    defaultState = { state: 'logged_out' };
  }

  const [appState, setAppState] = useState<AppState>(defaultState);

  const [defaultTabOverride, setDefaultTabOverride] = useState<TabName | undefined>(
    goTo
      ? ({
        'friends': 'friends',
        'watching': 'watching'
      } as const)[goTo]
      : undefined
  );

  const [faqOpen, setFaqOpen] = useState(false);

  const setToken = (token: string | null): void => {
    if (token === null) {
      setAppState({ state: 'logged_out' });
    } else {
      setAppState({ state: 'logged_in', token });
    }
  };

  // when using a saved token from local storage, we need to check with the server to make sure the session is valid
  useEffect(() => {
    if (appState.state === 'unverified_saved_token') {
      apiGet(sessionActiveEndpoint, {}, appState.token).then(sessionIsValid => {
        if (sessionIsValid) {
          setAppState({ state: 'logged_in', token: appState.token });
        } else {
          setAppState({ state: 'logged_out' });
        }
      }).catch(error => {
        console.log(error);
        setAppState({ state: 'offline' });
      });
    }
  }, [appState]);

  const changeSession = (token: string | null): void => {
    saveToken(token);
    setToken(token);
  };

  // when url query params contained a verification code, verify and log in account
  useEffect(() => {
    if (appState.state === 'verify_registration') {
      apiPut(verifyRegistrationEndpoint,
        { userUUID: appState.verificationUUID, verificationCode: appState.verificationCode }, {}, null)
        .then(response => {
          window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
          changeSession(response.token);
        })
        .catch(err => {
          setAppState({ state: 'verify_registration_failed', errorMessage: errorToMessage(err).message });
        });
    }
  }, []);

  // check at startup that server is online
  useEffect(() => {
    // not necessary if there's a saved token since a request will already be made for that
    if (appState.state !== 'unverified_saved_token') {
      apiGet(serverOnlineEndpoint, {}, null).catch((error: unknown) => {
        console.log(error);
        setAppState({ state: 'offline' });
      });
    }
  }, []);

  let appBody: JSX.Element;
  if (appState.state === 'offline') {
    appBody = <Offline />;
  } else if (appState.state === 'unverified_saved_token' || appState.state === 'verify_registration') {
    appBody = <LinearProgress />;
  } else if (appState.state === 'verify_registration_failed') {
    appBody = <VerifyRegistrationFailed message={appState.errorMessage} onDismiss={() => setToken(null)} />;
  } else if (appState.state === 'logged_out') {
    appBody = <LandingPage setSessionToken={changeSession} />;
  } else {
    appBody = <HomeRoot token={appState.token} initialTab={defaultTabOverride} />;
  }

  return (<Paper sx={{ height: '100vh', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
    <AppBar position="static">
      <Toolbar>
        <TaskAlt sx={{ marginRight: 1 }} />
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Busybody
        </Typography>
        {(appState.state === 'logged_in')
          ? <SettingsMenu token={appState.token} onLogOut={() => {
            setDefaultTabOverride(undefined);
            changeSession(null);
          }}
          changeTheme={props.changeTheme} currentThemeMode={props.currentThemeMode} />
          : <LoggedOutMenu changeTheme={props.changeTheme} currentThemeMode={props.currentThemeMode} />
        }
        <IconButton
          size="large"
          color="inherit"
          onClick={() => setFaqOpen(true)}
        >
          <Help />
        </IconButton>
        <InfoDialog open={faqOpen} onClose={() => setFaqOpen(false)} title='Frequently Asked Questions'>
          <FAQ/>
        </InfoDialog>
      </Toolbar>
    </AppBar>
    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
      {appBody}
    </Box>
  </Paper>);


}

export default App;
