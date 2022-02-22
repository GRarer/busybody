import { Box, Skeleton } from "@mui/material";

function TaskSkeleton(): JSX.Element {
  return (<Box sx={{ marginBottom: '5px' }}>
    <Skeleton variant="circular" height={40} width={40} animation="wave"/>
    <Skeleton variant="text" animation="wave"/>
    <Skeleton variant="text" animation="wave"/>
  </Box>);
}

export function TaskListSkeleton(): JSX.Element {
  return (<Box>
    <TaskSkeleton/>
    <TaskSkeleton/>
    <TaskSkeleton/>
    <TaskSkeleton/>
  </Box>);
}
