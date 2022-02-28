// functions for reading environment variables

export function getStringEV(key: string): string {
  const v = process.env[key];
  if (v === undefined) {
    throw new Error(`Fatal: missing required environment variable: ${key}`);
  }
  return v;
}

export function getIntEV(key: string): number {
  const v = Number.parseInt(getStringEV(key));
  if (Number.isNaN(v)) {
    throw new Error(`Fatal: environment variable ${key} must be an integer, was instead '${v}'`);
  }
  return v;
}

export function getBoolEV(key: string, defaultValue?: boolean): boolean {
  const v = process.env[key];
  if (v === undefined && defaultValue !== undefined) {
    return defaultValue;
  }
  if (v !== undefined) {
    const s = v.toLowerCase();
    if (s === 'true') {
      return true;
    } else if (s === 'false') {
      return false;
    }
  }
  throw new Error(`Fatal: environment variable ${key} must be 'true' or 'false', was instead '${v}'`);
}
