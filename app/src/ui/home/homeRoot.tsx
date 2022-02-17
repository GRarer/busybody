import { BottomNavigation, BottomNavigationAction, Container, Paper } from '@mui/material';
import React, { useState } from 'react';
import TaskIcon from '@mui/icons-material/Task';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';

export function HomeRoot(props: {
  token: string;
}): JSX.Element {

  const [pageIndex, setPageIndex] = useState<number>(0);

  const page = {
    0: <p>Watched tasks will go here</p>,
    1: <p>Tasks list will go here</p>,
    2: <p>Friends list will go here</p>
  }[pageIndex] ?? <p>Something went wrong, invalid page index!</p>;

  return <>
    <Container maxWidth="sm">
      {page}
    </Container>
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
