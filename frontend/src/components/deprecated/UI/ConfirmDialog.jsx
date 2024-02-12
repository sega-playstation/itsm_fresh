import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  ModalDialog,
  DialogTitle,
} from '@mui/joy';

import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export default function ConfirmDialog(props) {
  return (
    <ModalDialog variant="outlined" role="alertdialog">
      <DialogTitle>
        <WarningRoundedIcon />
        Confirmation
      </DialogTitle>
      <Divider />
      <DialogContent>{props.message}</DialogContent>
      <DialogActions>
        <Button variant="solid" color="danger" onClick={props.onConfirm}>
          Delete
        </Button>
        <Button variant="plain" color="neutral" onClick={props.onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </ModalDialog>
  );
}
