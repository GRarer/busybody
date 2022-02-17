import { AppBar, BottomNavigation, BottomNavigationAction, Container, Paper, Toolbar,
  Typography } from '@mui/material';
import React, { useState } from 'react';
import { HomeInfo } from './homeInfo';
import TaskIcon from '@mui/icons-material/Task';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SettingsMenu } from '../menu/settingsMenu';

export function HomeRoot(props: {
  token: string;
  onLogOut: () => void;
}): JSX.Element {

  const [pageIndex, setPageIndex] = useState<number>(0);

  const page = {
    0: <HomeInfo token={props.token} onLogOut={props.onLogOut}></HomeInfo>,
    1: <p>Tasks list will go here</p>,
    2: <p>Friends list will go here</p>
  }[pageIndex] ?? <p>Something went wrong, invalid page index!</p>;

  return <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
                Busybody
        </Typography>
        <div>
          <SettingsMenu token={props.token} onLogOut={props.onLogOut}/>
        </div>
      </Toolbar>
    </AppBar>
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
