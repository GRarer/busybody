import { Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { renderDate, unixSecondsToDate } from '../../../util/dates';
import React from 'react';

export function DueDate(props: {unixSeconds: number; overdue: boolean;}): JSX.Element {
  const time = renderDate(unixSecondsToDate(props.unixSeconds));
  // TODO integrate with theme colors
  const color = props.overdue ? red[500] : undefined;

  return <Typography variant="subtitle2" color={color}>Due {time}</Typography>;
}
