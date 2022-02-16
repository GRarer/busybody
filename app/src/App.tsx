import { LinearProgress } from '@mui/material';
import { sessionActiveEndpoint } from 'busybody-core';
import React, { useEffect, useState } from 'react';
import { apiGet } from './api/requests';
import { HomeRoot } from './ui/home/homeRoot';
import { LandingPage } from './ui/landing/Landing';
import { saveToken } from './util/persistence';

function App(
  props: {
    initialSavedToken: string | null;
  }
): JSX.Element {
  // uncheckedSavedToken is true if we are using a token read from local storage
  // and have not yet checked it with the server to make sure it's still valid
  const [state, setState] = useState<{token: string | null; uncheckedSavedToken: boolean;}>({
    token: props.initialSavedToken,
    uncheckedSavedToken: props.initialSavedToken !== null
  });

  const setToken = (token: string | null): void => {
    setState({ token, uncheckedSavedToken: false });
  };

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

  if (state.uncheckedSavedToken) {
    return (<LinearProgress/>);
  } else if (state.token) {
    // todo return home screen which contains all pages for signed-in users
    return (
      <HomeRoot token={state.token} onLogOut={() => { changeSession(null); }}/>
    );
  } else {
    return (
      // landing page is root of pages for not-signed-in users
      <LandingPage setSessionToken={changeSession}/>
    );
  }


}

export default App;
