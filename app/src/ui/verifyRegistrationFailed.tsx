import { ErrorOutline, Home } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

export function VerifyRegistrationFailed(props: {
  message: string,
  onDismiss: () => void
}): JSX.Element {
  return (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <ErrorOutline fontSize="large" sx={{ marginTop: 2, marginBottom: 1 }}/>
    <Typography variant="h6">Unable to verify registration</Typography>
    <Typography variant="body2">{props.message}</Typography>
    <Button variant="outlined" onClick={() => props.onDismiss()}
    startIcon={<Home/>} sx={{marginTop: 1}}>Back to home</Button>
  </Box>);
}
