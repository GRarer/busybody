import { Box, Card, CardActions, CardContent, CardHeader, Skeleton, Typography } from '@mui/material';
import { SortControls } from './sortControls';
import React from 'react';

function WatchedTaskSkeleton(): JSX.Element {
  return (<Card elevation={4} sx={{ marginBottom: '10px' }}>
    <CardHeader sx={{ paddingBottom: '0' }}
      avatar={<Skeleton variant='circular' width={40} height={40} animation='wave'/>}
      title={<Skeleton variant='text' animation='wave' width={150}/>}
      subheader={<Skeleton variant='text' animation='wave' width={120}/>}
    />
    <CardContent sx={{ paddingBottom: '0' }}>
      <Typography variant="body1">
        <Skeleton variant='text' animation='wave'/>
        <Skeleton variant='text' animation='wave'/>
        <Skeleton variant='text' animation='wave' width={300}/>
      </Typography>
    </CardContent>
    <CardActions>
      <Skeleton variant='text' animation='wave' width={180}/>
    </CardActions>
  </Card>);
}

export function WatchedTaskListSkeleton(): JSX.Element {
  return (<Box>
    <SortControls disabled options={[
      { key: 'date', label: 'Due Date' },
      { key: 'title', label: 'Task Name' },
      { key: 'owner', label: 'User' }
    ]} mode={{ field: 'date', ascending: true }} onChange={() => { }} />
    <WatchedTaskSkeleton />
    <WatchedTaskSkeleton />
    <WatchedTaskSkeleton />
  </Box>);
}
