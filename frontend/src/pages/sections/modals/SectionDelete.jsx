import { DialogContent, DialogActions, Button, Divider } from '@mui/joy';
import { useParams } from 'react-router-dom';
import { useDeleteCourse } from '@/hooks/query/courses/useCourse';

export default function SectionDelete({ color, handleClose }) {
  const { sectionId } = useParams();
  const { status, mutate } = useDeleteCourse(sectionId, handleClose);

  return (
    <>
      <DialogContent>
        Are you sure you want to delete this section?
      </DialogContent>
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
