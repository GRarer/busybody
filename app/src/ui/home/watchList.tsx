import { Box, Skeleton } from '@mui/material';
import React from 'react';

function WatchedTaskSkeleton(): JSX.Element {
  return (<Box sx={{ marginBottom: '5px' }}>
    <Skeleton variant="circular" height={40} width={40} animation="wave"/>
    <Skeleton variant="text" animation="wave"/>
    <Skeleton variant="text" animation="wave"/>
  </Box>);
}

export function WatchList(props: {
  token: string;
}): JSX.Element {
  return (<Box>
    <WatchedTaskSkeleton/>
    <WatchedTaskSkeleton/>
    <WatchedTaskSkeleton/>
    <WatchedTaskSkeleton/>
  </Box>);
}
