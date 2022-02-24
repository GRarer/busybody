import { format } from 'date-fns';

export function unixSecondsToDate(seconds: number): Date {
  // js date objects count *milliseconds* since epoch, but Busybody stores seconds
  return new Date(seconds * 1000);
}

export function dateToUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export const dateFormatString = 'EEEE MMMM d, yyyy h:mm a';

export function renderDate(d: Date): string {
  return format(d, 'EEEE MMMM d, yyyy h:mm a');
}
