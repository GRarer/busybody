import { Box, Skeleton, Container, Card, CardContent, CardHeader, CardActions, FilledInput, FormControl,
  InputLabel } from '@mui/material';
import React from 'react';

function FriendCardSkeleton(): JSX.Element {
  return <Card elevation={4} sx={{ marginBottom: '10px' }}>
    <CardHeader
      avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
      title={<Skeleton
        animation="wave"
        height={10}
        width="80%"
        style={{ marginBottom: 6 }}
      />}
      subheader={<Skeleton animation="wave" height={10} width="40%" />}
    />
    <CardActions>
      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
    </CardActions>
  </Card>;
}

function FriendHeaderSkeleton(): JSX.Element {
  return <Box sx={{ width: '200px', margin: 'auto', paddingBottom: '5px' }}>
    <Skeleton variant="text" animation="wave" height='30px' />
  </Box>;
}

export function FriendsPageSkeleton(): JSX.Element {
  return <Container maxWidth="xs">
    <FriendHeaderSkeleton />
    <Card elevation={4} sx={{ marginBottom: '10px' }}>
      <CardContent sx={{ paddingTop: '4px', paddingBottom: '0px' }}>
        <FormControl variant="filled" fullWidth>
          <InputLabel htmlFor="req-username-input"></InputLabel>
          <FilledInput id="req-username-input" value={''} disabled />
        </FormControl>
      </CardContent>
      <CardActions>
        <Skeleton variant="text" animation="wave" height='30px' width='100px' sx={{ marginLeft: '10px' }} />
      </CardActions>
    </Card>
    <FriendHeaderSkeleton />
    <FriendCardSkeleton />
    <FriendHeaderSkeleton />
    <FriendCardSkeleton />
    <FriendCardSkeleton />
    <FriendCardSkeleton />
  </Container>;
}
