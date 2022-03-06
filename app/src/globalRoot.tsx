// stack of providers for global context and for local storage information read at start-up

import { createTheme, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';
import App from './App';
import { loadSavedThemeMode, loadSavedToken, saveThemeMode } from './util/persistence';
import React from 'react';

// load initial state
const savedToken = loadSavedToken();
const savedThemeMode = loadSavedThemeMode();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export function GlobalRoot(): JSX.Element {

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(savedThemeMode ?? 'dark');
  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  function updateThemeMode(mode: 'light' | 'dark'): void {
    setThemeMode(mode);
    saveThemeMode(mode);
  }

  return <ThemeProvider theme={currentTheme}>
    <SnackbarProvider maxSnack={1} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
      <App initialSavedToken={savedToken} changeTheme={updateThemeMode} currentThemeMode={themeMode}/>
    </SnackbarProvider>
  </ThemeProvider>;
}
