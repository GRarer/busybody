import { Logout, AccountBox, AlternateEmail, VpnKey, DataArray } from '@mui/icons-material';
import { MenuItem, ListItemIcon, ListItemText, Divider, Menu, IconButton } from '@mui/material';
import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { apiPost } from '../../api/requests';
import { logoutEndpoint } from 'busybody-core';

export function SettingsMenu(props: {
  token: string;
  onLogOut: () => void;
}): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    setAnchorEl(event.currentTarget);
  };
  const close = (): void => {
    setAnchorEl(null);
  };

  const logOut = (): void => {
    apiPost(logoutEndpoint, undefined, {}, props.token)
      .then(props.onLogOut)
      .catch(error => {
        console.error('failed to log out of server');
        console.log(error);
      })
      .finally(props.onLogOut);
  };

  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        onClick={open}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={close}
      >
        <MenuItem>
          <ListItemIcon><AccountBox fontSize="small" /></ListItemIcon>
          <ListItemText>Change Personal Info</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon><AlternateEmail fontSize="small" /></ListItemIcon>
          <ListItemText>Change Email Address</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon><VpnKey fontSize="small" /></ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon><DataArray fontSize="small" /></ListItemIcon>
          <ListItemText>Manage Personal Data</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logOut}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
