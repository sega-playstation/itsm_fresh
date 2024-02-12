import { DialogContent, DialogActions, Button, Divider } from '@mui/joy';
import { useParams } from 'react-router-dom';
import { useDeleteUser } from '@/hooks/query/users/useUser';

export default function UserDelete({ color, handleClose }) {
  const { userId } = useParams();
  const { status, mutate } = useDeleteUser(userId, handleClose);

  return (
    <>
      <DialogContent>Are you sure you want to delete this user?</DialogContent>
      <Divider inset="context" />
      <DialogActions>
        <Button
          variant="solid"
          color={color}
          loading={status === 'pending'}
          onClick={mutate}
          size="sm"
        >
          Delete
        </Button>
        <Button variant="plain" color="neutral" onClick={handleClose} size="sm">
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
