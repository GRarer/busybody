import { Box, Skeleton } from '@mui/material';
import React from 'react';

function FriendSkeleton(): JSX.Element {
  return (<Box sx={{ marginBottom: '5px' }}>
    <Skeleton variant="circular" animation="wave" width={40} height={40}/>
    <Skeleton variant="text" animation="wave"/>
  </Box>);
}

export function FriendsList(props: {
  token: string;
}): JSX.Element {

  const skeletons: JSX.Element[] = [];
  for (let i = 0; i < 20; i++) {
    skeletons.push(<FriendSkeleton/>);
  }
  return (<Box>
    {skeletons}
  </Box>);
}
