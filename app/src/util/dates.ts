import { addWeeks, format, setHours, setMinutes } from 'date-fns';

// TODO we should be rounding everything to the nearest minute

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

export function getNextWeek(): Date {
  // TODO should this be a specific time in the day instead of an integer number of days in the future?
  const exactlyNextWeek = addWeeks((new Date()), 1);
  return setHours(setMinutes(exactlyNextWeek, 59), 23);
}
