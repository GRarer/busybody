import { FormHelperText } from '@mui/material';
import React from 'react';

export function OptionalInputWarning(props: {
  message: string | undefined;
}): JSX.Element {
  if (props.message) {
    return (<FormHelperText>{props.message}</FormHelperText>);
  } else {
    return (<></>);
  }
}
