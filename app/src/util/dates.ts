export function unixSecondsToDate(seconds: number): Date {
  // js date objects count *milliseconds* since epoch, but Busybody stores seconds
  return new Date(seconds * 1000);
}

function pad2(n: number): string {
  if(n < 10) {
    return `0${n}`;
  } else {
    return `${n}`;
  }
}

// renders a date as an ISO string
export function renderDate(d: Date): string {
  // TODO better date format
  return d.toDateString() + ' ' + d.toTimeString();
}
