import { Box, Skeleton } from '@mui/material';
import React from 'react';

function TaskSkeleton(props: {lines: number;}): JSX.Element {
  const text: JSX.Element[] = [];
  for (let i = 0; i < props.lines; i++) {
    text.push(<Skeleton variant="text" animation="wave"/>);
  }

  return (<Box sx={{ marginBottom: '5px' }}>
    <Skeleton variant="rectangular" height={100} animation="wave"/>
    {text}
  </Box>);
}

export function TasksList(props: {
  token: string;
}): JSX.Element {
  return (<Box>
    <TaskSkeleton lines={3}/>
    <TaskSkeleton lines={1}/>
    <TaskSkeleton lines={0}/>
    <TaskSkeleton lines={5}/>
    <TaskSkeleton lines={3}/>
    <TaskSkeleton lines={2}/>
    <TaskSkeleton lines={2}/>
    <TaskSkeleton lines={2}/>
  </Box>);
}
