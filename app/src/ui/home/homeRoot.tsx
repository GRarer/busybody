import { BottomNavigation, BottomNavigationAction, Box, Container, Paper } from '@mui/material';
import React, { useState } from 'react';
import TaskIcon from '@mui/icons-material/Task';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TasksList } from './tasksList';
import { WatchList } from './watchList';
import { FriendsList } from './friendsList';

export function HomeRoot(props: {
  token: string;
}): JSX.Element {

  const [pageIndex, setPageIndex] = useState<number>(1);

  const page = {
    0: <WatchList token={props.token}/>,
    1: <TasksList token={props.token}/>,
    2: <FriendsList token={props.token}/>
  }[pageIndex] ?? <p>Something went wrong, invalid page index!</p>;

  return <>
    <Box>
      <Container maxWidth="sm" sx={{ marginBottom: 7 }}>
        {page}
      </Container>
    </Box>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        value={pageIndex}
        onChange={(event, newValue) => {
          setPageIndex(newValue);
        }}
      >
        <BottomNavigationAction label="Watching" icon={<VisibilityIcon />} />
        <BottomNavigationAction label="Tasks" icon={<TaskIcon />} />
        <BottomNavigationAction label="Friends" icon={<GroupsIcon />} />
      </BottomNavigation>
    </Paper>
  </>;
}
