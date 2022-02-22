import { Card, CardActions, Button, CardContent, FilledInput, FormControl, InputLabel } from '@mui/material';
import { FriendsListResponse, sendFriendRequestEndpoint } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiPut } from '../../../api/requests';
import { errorToMessage } from '../../../util/util';

export function FriendRequestFormCard(props: {
  token: string;
  onRequestSent: (data: FriendsListResponse) => void;
}): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState('');

  function send(): void {
    apiPut(sendFriendRequestEndpoint, { username }, {}, props.token)
      .then(newState => {
        setUsername('');
        props.onRequestSent(newState);
      })
      .catch(error => {
        const message = errorToMessage(error);
        enqueueSnackbar(message.message, { variant: 'error' });
      });
  };

  const handleKeypress: React.KeyboardEventHandler<HTMLDivElement> = (ev): void => {
    if (ev.key === 'Enter' && Boolean(username)) {
      send();
    }
  };

  return <Card elevation={4} sx={{ marginBottom: '10px' }}>
    <CardContent sx={{ paddingTop:'4px', paddingBottom: '0px' }}>
      <FormControl variant="filled" fullWidth onKeyPress={handleKeypress}>
        <InputLabel htmlFor="req-username-input">Friend&apos;s Username</InputLabel>
        <FilledInput id="req-username-input" value={username} onChange={ev => { setUsername(ev.target.value); }} />
      </FormControl>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={() => send()} disabled={!username}>Send Friend Request </Button>
    </CardActions>
  </Card>;
}
