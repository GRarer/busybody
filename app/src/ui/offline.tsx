import { CloudOff } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import React from 'react';

export function Offline(): JSX.Element {
  return (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <CloudOff fontSize="large" sx={{ marginTop: 2, marginBottom: 1 }}/>
    <Typography variant="h6">Cannot connect to Busybody</Typography>
    <Typography variant="body2">The server may be offline.</Typography>
  </Box>);
}
