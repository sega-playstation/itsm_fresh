import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
} from '@mui/joy';
import LabelText from '@/components/joy/LabelText';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { useUser } from '@/hooks/query/users/useUser';
import NavigateParams from '@/components/NavigateParams';

export default function UserView({ handleClose, closeTo }) {
  const { userId } = useParams();
  const { status, data } = useUser(userId);

  if (status === 'pending') return <LoadingSpinner />;
  if (status === 'error') return <NavigateParams to={closeTo} />;

  return (
    <>
      <DialogContent>
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <LabelText label="Name">{`${data.first_name} ${data.last_name}`}</LabelText>
          <LabelText label="Email">{data.email}</LabelText>
          <LabelText label="Role">{data.role_name}</LabelText>
          <LabelText label="Sections">
            <Stack direction="row" spacing={0.5}>
              {data.course_details.map((course) => (
                <Chip key={`course-${course.id}`} variant="outlined" size="sm">
                  {`${course.term}${course.year}-${course.section}`}
                </Chip>
              ))}
            </Stack>
          </LabelText>
        </Stack>
      </DialogContent>
      <Divider inset="context" />
      <DialogActions buttonFlex="none">
        <Button variant="solid" color="neutral" onClick={handleClose} size="sm">
          Close
        </Button>
      </DialogActions>
    </>
  );
}
