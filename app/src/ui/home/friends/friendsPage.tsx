
import {
  Button, Container, Typography } from '@mui/material';
import {
  answerRequestEndpoint, cancelFriendRequestEndpoint, FriendInfo, FriendsListResponse, getFriendsListEndpoint,
  unfriendEndpoint
} from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../../../util/requests';
import { errorToMessage } from '../../../util/util';
import { ConfirmDialog } from '../../common/confirmDialog';
import { FriendCard } from './friendCard';
import { FriendsPageSkeleton } from './friendsPageSkeleton';
import { FriendRequestFormCard } from './requestFormCard';

export function FriendsPage(props: {
  token: string;
}): JSX.Element {

  const { enqueueSnackbar } = useSnackbar();

  const [friendsList, setFriendsList] = useState<FriendsListResponse | null>(null);
  const [unfriendDialogSelection, setUnfriendDialogSelection] = useState<FriendInfo | null>(null);



  useEffect(() => {
    if (friendsList === null) {
      apiGet(getFriendsListEndpoint, {}, props.token)
        .then(data => {
          setFriendsList(data);
        })
        .catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
        });
    }
  }, [friendsList, props.token]);

  function unfriendUser(target: FriendInfo): void {
    apiPut(unfriendEndpoint, { uuid: target.uuid }, {}, props.token)
      .then(newState => { setFriendsList(newState); })
      .catch(error => {
        const message = errorToMessage(error);
        const severity = message.code === 500 ? 'error' : 'warning';
        enqueueSnackbar(message.message, { variant: severity });
      });
  }

  function answerFriendRequest(target: FriendInfo, accept: boolean): void {
    apiPut(answerRequestEndpoint, { uuid: target.uuid, accept: accept }, {}, props.token)
      .then(newState => { setFriendsList(newState); })
      .catch(error => {
        const message = errorToMessage(error);
        const severity = message.code === 500 ? 'error' : 'warning';
        enqueueSnackbar(message.message, { variant: severity });
      });
  }

  function cancelFriendRequest(target: FriendInfo): void {
    apiPut(cancelFriendRequestEndpoint, { uuid: target.uuid }, {}, props.token)
      .then(newState => { setFriendsList(newState); })
      .catch(error => {
        const message = errorToMessage(error);
        const severity = message.code === 500 ? 'error' : 'warning';
        enqueueSnackbar(message.message, { variant: severity });
      });
  }

  if (friendsList === null) {
    return <FriendsPageSkeleton />;
  }

  const incomingColumn = <>
    <Typography variant="h6" sx={{ textAlign: 'center' }}>Pending Friend Requests</Typography>
    {friendsList.incomingRequests.map(friend => (
      <FriendCard info={friend} key={friend.uuid}>
        <Button size="small" onClick={() => answerFriendRequest(friend, true)}>Accept</Button>
        <Button size="small" onClick={() => answerFriendRequest(friend, false)}>Reject</Button>
      </FriendCard>
    ))}
  </>;

  const outgoingColumn = <>
    <Typography variant="h6" sx={{ textAlign: 'center' }}>Sent Friend Requests</Typography>
    {friendsList.outgoingRequests.map(friend => (
      <FriendCard info={friend} key={friend.uuid}>
        <Button size="small" onClick={() => cancelFriendRequest(friend)}>Cancel</Button>
      </FriendCard>
    ))}
  </>;

  const friendsColumn = <>
    <Typography variant="h6" sx={{ textAlign: 'center' }}>Your Friends</Typography>
    {friendsList.friends.map(friend => (
      <FriendCard info={friend} key={friend.uuid}>
        <Button size="small" onClick={() => setUnfriendDialogSelection(friend)}>Unfriend</Button>
      </FriendCard>
    ))}
  </>;

  return <>
    <Container maxWidth="xs">
      <Typography variant="h6" sx={{ textAlign: 'center' }}>Add Friends</Typography>
      <FriendRequestFormCard token={props.token} onRequestSent={(data) => setFriendsList(data)} />
      {friendsList.incomingRequests.length > 0
        ? incomingColumn
        : <></>
      }
      {friendsList.outgoingRequests.length > 0
        ? outgoingColumn
        : <></>
      }
      {friendsList.friends.length > 0
        ? friendsColumn
        : <Typography variant="body1" sx={{ textAlign: 'center' }}>
          Your haven&apos;t connected with any friends yet. Send and receive friend requests
          to connect with your friends.
        </Typography>
      }
    </Container>
    <ConfirmDialog
      open={unfriendDialogSelection !== null}
      onClose={() => setUnfriendDialogSelection(null)}
      title={`Unfriend ${unfriendDialogSelection?.fullName}?`}
      body={/* // TODO use correct gender pronouns? */`Do you want to remove ${unfriendDialogSelection?.fullName}
      (${unfriendDialogSelection?.username}) from your friends list? You will be unable to watch their tasks and
      they will be unable to watch your tasks.`}
    >
      <Button onClick={() => {
        unfriendUser(unfriendDialogSelection!);
        setUnfriendDialogSelection(null);
      }} color="warning">Unfriend</Button>
    </ConfirmDialog>
  </>;
}
