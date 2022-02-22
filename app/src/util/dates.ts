export function unixSecondsToDate(seconds: number): Date {
  // js date objects count *milliseconds* since epoch, but Busybody stores seconds
  return new Date(seconds * 1000);
}

// renders a date as an ISO string
export function renderDate(d: Date): string {
  // TODO better date format
  return d.toDateString() + ' ' + d.toTimeString();
}
