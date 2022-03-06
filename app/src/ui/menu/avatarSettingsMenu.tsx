import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel,
  LinearProgress, Radio, RadioGroup, Typography } from '@mui/material';
import { emailToGravatarURL, FriendInfo, selfInfoEndpoint, toggleGravatarEndpoint } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../../util/requests';
import { errorToMessage } from '../../util/util';
import { FriendAvatar } from '../home/friends/friendCard';

export function AvatarSettingsMenu(
  props: {
    token: string;
    open: boolean;
    onClose: () => void;
  }
): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();

  const [infos, setInfos] = useState<{
    withGravatar: FriendInfo;
    withoutGravatar: FriendInfo;
  } | undefined>(undefined);
  const [useGravatar, setUseGravatar] = useState<boolean>(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // get info
    if (props.open) {
      if (infos === undefined) {
        apiGet(selfInfoEndpoint, {}, props.token).then(info => {
          setUseGravatar(info.useGravatar);
          setEmail(info.email);
          setInfos({
            withGravatar: {
              uuid: info.uuid,
              fullName: info.fullName,
              nickname: info.nickname,
              username: info.username,
              avatarUrl: emailToGravatarURL(info.email)
            },
            withoutGravatar: {
              uuid: info.uuid,
              fullName: info.fullName,
              nickname: info.nickname,
              username: info.username,
              avatarUrl: undefined
            }
          });
        }).catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
          props.onClose();
        });
      }
    } else {
      setInfos(undefined);
    }
  }, [props.open, props.token, infos]);



  const canUpdate = infos !== undefined;

  function update(): void {
    apiPut(toggleGravatarEndpoint, useGravatar, {}, props.token)
      .then(() => {
        enqueueSnackbar('Your avatar preference has been saved', { variant: 'success' });
        props.onClose();
      })
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }



  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Customize Avatar</DialogTitle>
      {infos === undefined
        ? <LinearProgress />
        : <>
          <DialogContent>
            <FormControl>
              <FormLabel>Avatar Style</FormLabel>
              <RadioGroup
                value={useGravatar ? 'gravatar' : 'name'}
                onChange={event => setUseGravatar(event.target.value === 'gravatar')}
              >
                <FormControlLabel style={{ marginBottom: '10px' }} value={'name'} control={<Radio />} label={
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                    <FriendAvatar info={infos.withoutGravatar} />
                    <p style={{ marginLeft: '5px', marginTop: 0, marginBottom: 0 }}>Initials</p>
                  </div>
                } />
                <FormControlLabel value={'gravatar'} control={<Radio />} label={
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                    <FriendAvatar info={infos.withGravatar} />
                    <p style={{ marginLeft: '5px', marginTop: 0, marginBottom: 0 }}>Gravatar</p>
                  </div>
                } />
              </RadioGroup>
            </FormControl>
            <Typography variant="body2">
              To change your Gravatar image, go to <a href="https://gravatar.com/connect" target="_blank"
                rel="noreferrer">gravatar.com</a> and sign in or create an account using the same email address that you
              use for Busybody ({email}). Gravatar is a service provided by Automattic, the company behind Wordpress.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={update} disabled={!canUpdate}>Update</Button>
          </DialogActions>
        </>}
    </Dialog>
  );

}
