import { Card, CardActions, Avatar, CardHeader } from '@mui/material';
import { FriendInfo } from 'busybody-core';
import React from 'react';

function nameToInitials(name: string): string {
  const words = name.split(' ').filter(word => word !== '');
  if (words.length === 0) {
    return '';
  } else if (words.length === 1) {
    return name[0];
  }
  const first = words[0];
  const last = words[words.length - 1];
  return `${first[0]}${last[0]}`;
}

// based on example code from https://mui.com/components/avatars/
function nameToColor(name: string): string {
  let hash = 0;
  let i;

  for (i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export function FriendAvatar(props: {info: FriendInfo;}): JSX.Element {
  return <Avatar sx={{ bgcolor: nameToColor(props.info.username) }}>
    {nameToInitials(props.info.fullName)}
  </Avatar>;
}

export function FriendCard(props: React.PropsWithChildren<{ info: FriendInfo;}>): JSX.Element {
  return <Card elevation={4} sx={{ marginBottom: '10px' }}>
    <CardHeader sx={{ paddingBottom: '0' }}
      avatar={<FriendAvatar info={props.info}/>}
      title={props.info.fullName}
      subheader={props.info.username}
    />
    <CardActions>
      {props.children}
    </CardActions>
  </Card>;
}
