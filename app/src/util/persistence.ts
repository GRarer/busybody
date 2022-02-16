const TOKEN_LS_KEY = 'busybody-session-token';

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
    console.error('failed to save session token to local storage');
    console.log(err);
    return null;
  }
}
