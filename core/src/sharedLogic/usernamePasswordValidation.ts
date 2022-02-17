// format requirements for usernames and passwords
// return undefined if no problem, or message if there is a problem
export function usernameRequirementProblem(username: string): string | undefined {
  if (username === '') {
    return 'Username cannot be empty';
  }
  if (username.length > 32) {
    return 'Username must not be longer than 32 characters';
  }
  // @ is disallowed to prevent usernames that look like email addresses
  // whitespace including u00A0 non-breaking space are disallowed
  for (const badCharacter of ['@', ' ', '\u00A0', '#', '/', '\\', "'", '"', '\n', '\t']) {
    if (username.includes(badCharacter)) {
      return (`Username cannot contain the character "${badCharacter}"`);
    }
  }
  return undefined;
}

export function passwordRequirementProblem(password: string): string | undefined {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return undefined;
}
