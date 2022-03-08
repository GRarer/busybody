import { BottomNavigation, BottomNavigationAction, Box, Container, Paper } from '@mui/material';
import React, { useState } from 'react';
import TaskIcon from '@mui/icons-material/Task';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TasksList } from './tasks/tasksList';
import { WatchList } from './tasks/watchList';
import { FriendsPage } from './friends/friendsPage';

export type TabName = 'watching' | 'tasks' | 'friends';

export function HomeRoot(props: {
  token: string;
  initialTab?: TabName;
}): JSX.Element {

  const initialTabIndex = props.initialTab
    ? {
      'watching': 0,
      'tasks': 1,
      'friends': 2
    }[props.initialTab]
    : 1;

  const [tabIndex, setTabIndex] = useState<number>(initialTabIndex);

  const page = {
    0: <WatchList token={props.token}/>,
    1: <TasksList token={props.token}/>,
    2: <FriendsPage token={props.token}/>
  }[tabIndex] ?? <p>Something went wrong, invalid page index!</p>;

  return <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="sm" sx={{ marginBottom: 7, overflowY: 'auto', paddingTop: '10px' }}>
        {page}
      </Container>
    </Box>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        value={tabIndex}
        onChange={(event, newValue) => {
          setTabIndex(newValue);
        }}
      >
        <BottomNavigationAction label="Watching" icon={<VisibilityIcon />} />
        <BottomNavigationAction label="Tasks" icon={<TaskIcon />} />
        <BottomNavigationAction label="Friends" icon={<GroupsIcon />} />
      </BottomNavigation>
    </Paper>
  </Box>;
}
