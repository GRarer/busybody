import { addWeeks, format, setHours, setMinutes, setSeconds } from 'date-fns';

export function unixSecondsToDate(seconds: number): Date {
  // js date objects count *milliseconds* since epoch, but Busybody stores seconds
  // we round all times to the nearest minute
  return setSeconds(new Date(seconds * 1000), 0);
}

export function dateToUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function currentTimeSeconds(): number {
  return dateToUnixSeconds(new Date());
}

export const dateFormatString = 'EEEE MMMM d, yyyy h:mm a';

export function renderDate(d: Date): string {
  return format(d, 'EEEE MMMM d, yyyy h:mm a');
}

export function getNextWeek(): Date {
  const exactlyNextWeek = addWeeks((new Date()), 1);
  return setHours(setMinutes(exactlyNextWeek, 59), 23);
}

export async function sleepSeconds(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, (seconds * 1000)));
}
