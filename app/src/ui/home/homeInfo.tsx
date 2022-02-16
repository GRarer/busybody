import { LinearProgress } from '@mui/material';
import { logoutEndpoint, selfInfoEndpoint, SelfInfoResponse } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../api/requests';
import { errorToMessage } from '../../util/util';

export function HomeInfo(props: {
  token: string;
  onLogOut: () => void;
}): JSX.Element {
  const [info, setInfo] = useState<SelfInfoResponse | undefined>(undefined);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // get info
    apiGet(selfInfoEndpoint, {}, props.token).then(setInfo).catch(error => {
      enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
    });
  }, []);

  if (info === undefined) {
    return (<LinearProgress/>);
  }

  const logOut = (): void => {
    console.log('logging out...');
    apiPost(logoutEndpoint, undefined, {}, props.token).then(props.onLogOut).catch(error => {
      console.error('failed to log out of server');
      console.log(error);
    });
    props.onLogOut();
  };

  return (<div>
    <p>{`logged in as username: ${info.username}`}</p>
    <p>{`full name: ${info.fullName}`}</p>
    <p>{`nickname: ${info.nickname}`}</p>
    <p>{`email address: ${info.email}`}</p>
    <button onClick={logOut}>log out</button>
  </div>);


}
