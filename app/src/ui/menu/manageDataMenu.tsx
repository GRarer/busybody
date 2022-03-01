import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from '@mui/material';
import { deleteAccountEndpoint, exportPersonalDataEndpoint } from 'busybody-core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { apiDelete, apiGet } from '../../util/requests';
import { errorToMessage } from '../../util/util';
import { CloudDownload, DeleteForever } from '@mui/icons-material';
import { ConfirmDialog } from '../common/confirmDialog';

// unfortunately this direct dom manipulation is the accepted way to download a dynamically-created file
function downloadFile(contents: string, filename: string): void {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(new Blob([contents]));
  link.setAttribute(
    'download',
    filename,
  );
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

export function ManageDataDialog(
  props: {
    token: string;
    open: boolean;
    onClose: () => void;
    onDeleteAccount: () => void;
  }
): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  function downloadData(): void {
    apiGet(exportPersonalDataEndpoint, {}, props.token)
      .then((data => {
        console.log(data);
        const json = JSON.stringify(data, null, 4);
        downloadFile(json, 'busybody_export.json');
        enqueueSnackbar('Download Complete', { variant: 'success' });
        props.onClose();
      }))
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }

  function deleteAccount(): void {
    apiDelete(deleteAccountEndpoint, {}, props.token).then(() => {
      enqueueSnackbar('Your account has been deleted', { variant: 'info' });
      props.onDeleteAccount();
    })
      .catch(error => {
        enqueueSnackbar(errorToMessage(error).message, { variant: 'error' });
      });
  }


  return (
    <>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Mange Your Personal Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can export and download your personal data, including your to-do tasks and friends list,
            as a JSON file.
          </DialogContentText>
          <Button fullWidth variant="contained" endIcon={<CloudDownload />} onClick={downloadData}>
            Download Account Data
          </Button>
          <Divider sx={{ marginTop: '15px', marginBottom: '10px' }} />
          <DialogContentText>
            If you choose to close your account, we will permanently delete all of your personal data from our servers,
            including your to-do tasks and friends list.
          </DialogContentText>
          <Button fullWidth variant="contained" color="warning" endIcon={<DeleteForever />}
            onClick={() => setShowConfirmDelete(true)}>
            Delete Account
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        maxWidth='xs'
        title='Permanently delete your account?'
        body={
          <>This will delete your account, including your friends list and all of your
          to-do tasks. <span style={{ fontWeight: 'bold' }}>This action cannot be undone.</span></>
        }
      >
        <Button onClick={deleteAccount} color="warning">
            Delete My Account
        </Button>
      </ConfirmDialog>
    </>
  );

}
