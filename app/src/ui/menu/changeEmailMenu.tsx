import { AlternateEmail, Send } from '@mui/icons-material';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputLabel,
  LinearProgress,
  Typography
} from '@mui/material';
import { requestEmailUpdateCodeEndpoint, selfInfoEndpoint, updateEmailEndpoint } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut } from '../../util/requests';
import { absurd, errorToMessage } from '../../util/util';

export function ChangeEmailDialog(
  props: {
    token: string;
    open: boolean;
    onClose: () => void;
  }
): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();

  const [step, setStep] = useState<'loading' | 'address' | 'sending' | 'verification'>('loading');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');



  // load current address when dialog opens
  useEffect(() => {
    // get info
    if (props.open) {
      if (step === 'loading') {
        apiGet(selfInfoEndpoint, {}, props.token).then(info => {
          setEmail(info.email);
          setStep('address');
        }).catch(error => {
          enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
          props.onClose();
        });
      }
    } else {
      setStep('loading');
      setEmail('');
      setVerificationCode('');
    }
  }, [props.open, props.token, step]);

  function sendCode(): void {
    setStep('sending');
    apiPost(requestEmailUpdateCodeEndpoint, { newEmail: email }, {}, props.token).then(() => {
      setStep('verification');
    }).catch(error => {
      enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      setStep('address');
    });
  }

  function updateEmail(): void {
    apiPut(updateEmailEndpoint, { newEmail: email, verificationCode }, {}, props.token).then(() => {
      enqueueSnackbar(`Your email address has been changed to ${email}`, { variant: 'success' });
      props.onClose();
    }).catch(error => {
      enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
    });
  }

  let contents: JSX.Element;
  if (step === 'loading' || step === 'sending') {
    contents = <LinearProgress />;
  } else if (step === 'address') {
    contents = <>
      <FormControl variant="filled" fullWidth >
        <InputLabel htmlFor="email-input">New Email address</InputLabel>
        <FilledInput id="email-input" value={email} onChange={ev => { setEmail(ev.target.value); }} />
      </FormControl>
      <Button variant="outlined" startIcon={<Send />} onClick={sendCode} disabled={!email}
        sx={{ marginTop: 1 }}>
        Get Verification Code
      </Button>
    </>;
  // this is for totality checking
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (step === 'verification') {
    contents = <>
      <Typography>A verification code has been sent to {email}. Enter the code here to update your email
        address</Typography>
      <FormControl variant="filled" fullWidth >
        <InputLabel htmlFor="code-input">Verification Code</InputLabel>
        <FilledInput id="code-input" value={verificationCode}
          onChange={ev => { setVerificationCode(ev.target.value); }} />
      </FormControl>
      <Button variant="outlined" startIcon={<AlternateEmail />} onClick={updateEmail} disabled={!verificationCode}
        sx={{ marginTop: 1 }}>
        Update Email
      </Button>
    </>;
  } else {
    contents = absurd(step);
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Change Email Address</DialogTitle>
      <DialogContent>
        {contents}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
