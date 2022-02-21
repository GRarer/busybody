import { BottomNavigation, BottomNavigationAction, Box, Container, Paper } from '@mui/material';
import React, { useState } from 'react';
import TaskIcon from '@mui/icons-material/Task';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TasksList } from './tasksList';
import { WatchList } from './watchList';
import { FriendsPage } from './friends/friendsPage';

export function HomeRoot(props: {
  token: string;
}): JSX.Element {

  // TODO disable navigating while editor dialogs are open in child pages since this would lose state
  const [pageIndex, setPageIndex] = useState<number>(1);

  const page = {
    0: <WatchList token={props.token}/>,
    1: <TasksList token={props.token}/>,
    2: <FriendsPage token={props.token}/>
  }[pageIndex] ?? <p>Something went wrong, invalid page index!</p>;

  return <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="sm" sx={{ marginBottom: 7, overflowY: 'auto', paddingTop: '10px' }}>
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
  </Box>;
}
