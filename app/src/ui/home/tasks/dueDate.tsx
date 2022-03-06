import { Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { renderDate, unixSecondsToDate } from 'busybody-core';
import React from 'react';

export function DueDate(props: {unixSeconds: number;}): JSX.Element {
  const time = renderDate(unixSecondsToDate(props.unixSeconds));
  const color = ((props.unixSeconds * 1000) < Date.now()) ? red[500] : undefined;

  return <Typography variant="subtitle2" color={color}>Due {time}</Typography>;
}
