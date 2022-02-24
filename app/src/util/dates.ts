import { TextFieldProps } from "@mui/material";
import { format } from 'date-fns'

export function unixSecondsToDate(seconds: number): Date {
  // js date objects count *milliseconds* since epoch, but Busybody stores seconds
  return new Date(seconds * 1000);
}

export function dateToUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export const dateFormatString = 'EEEE MMMM d, yyyy h:mm a';

// renders a date as an ISO string
export function renderDate(d: Date): string {
  // TODO better date format
  //return d.toDateString() + ' ' + d.toTimeString();
  return format(d, 'EEEE MMMM d, yyyy h:mm a');
  //return d.toLocaleDateString(undefined, {dateStyle: 'full'}) + ' ' + d.toLocaleTimeString(undefined, {timeStyle: 'short'});
}
