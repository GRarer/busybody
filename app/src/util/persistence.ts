const TOKEN_LS_KEY = 'busybody-session-token';
const THEME_MODE_KEY = 'busybody-theme-mode';

export function saveToken(token: string | null): void {
  try {
    if (token === null) {
      localStorage.removeItem(TOKEN_LS_KEY);
    } else {
      localStorage.setItem(TOKEN_LS_KEY, token);
    }
  } catch (err) {
    console.error('failed to save session token to local storage');
    console.log(err);
  }
}

export function loadSavedToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_LS_KEY);
  } catch (err) {
    console.error('failed to load session token from local storage');
    console.log(err);
    return null;
  }
}

export function saveThemeMode(mode: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_MODE_KEY, mode);
  } catch (err) {
    console.error('failed to save theme mode to local storage');
    console.log(err);
  }
}

export function loadSavedThemeMode(): 'light' | 'dark' | null {
  try {
    const saved = localStorage.getItem(THEME_MODE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return null;
  } catch (err) {
    console.error('failed to load saved theme mode from local storage');
    console.log(err);
    return null;
  }
}
