import React, { useState } from 'react';
import { LandingPage } from './ui/landing/Landing';
import { StatusDisplay } from './ui/StatusDisplay';

function App(): JSX.Element {
  const [token, setToken] = useState<string | undefined>(undefined);

  if (token) {
    // todo return home screen which contains all pages for signed-in users
    return (
      <StatusDisplay/>
    );
  } else {
    return (
      // landing page is root of pages for not-signed-in users
      <LandingPage setSessionToken={setToken}/>
    );
  }


}

export default App;
