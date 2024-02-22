import { useDeleteChange } from '@/hooks/query/changes/useChange';
import UserContext from '@/components/UserContext';
import { UserRole } from '@/utils/enums';
import { DialogContent, DialogActions, Button, Divider } from '@mui/joy';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

export default function ChangeDelete({ color, handleClose }) {
  const { user, selectedCourse } = useContext(UserContext);
  const { changeId } = useParams();
  const { status, mutate } = useDeleteChange(
    changeId,
    user.roleId !== UserRole.ADMIN ? selectedCourse : undefined,
    handleClose,
  );

  return (
    <>
      <DialogContent>Are you sure you want to delete this change?</DialogContent>
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
