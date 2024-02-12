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
import { useProcessUser } from '@/hooks/query/users/useProcessUser';
import { useState } from 'react';
import NavigateParams from '@/components/NavigateParams';

export default function AccountReview({ handleClose, closeTo }) {
  const { userId } = useParams();
  const { status, data } = useUser(userId);
  const { status: processStatus, mutate } = useProcessUser(handleClose);
  const [decision, setDecision] = useState();

  if (status === 'pending') return <LoadingSpinner />;
  if (status === 'error') return <NavigateParams to={closeTo} />;

  return (
    <>
      <DialogContent>
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <LabelText label="Name">{`${data.first_name} ${data.last_name}`}</LabelText>
          <LabelText label="Email">{data.email}</LabelText>
          <LabelText label="Section">
            <Stack direction="row" spacing={0.5}>
              {data.course.map((course) => (
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
        <Button
          variant="solid"
          color="success"
          disabled={processStatus === 'pending' && decision !== 'accept'}
          loading={processStatus === 'pending' && decision === 'accept'}
          onClick={() => {
            setDecision('accept');
            mutate({ userId: userId, decision: 'accept' });
          }}
          size="sm"
        >
          Approve
        </Button>
        <Button
          variant="solid"
          color="danger"
          disabled={processStatus === 'pending' && decision !== 'reject'}
          loading={processStatus === 'pending' && decision === 'reject'}
          onClick={() => {
            setDecision('reject');
            mutate({ userId: userId, decision: 'reject' });
          }}
          size="sm"
        >
          Reject
        </Button>
        <Button
          variant="plain"
          color="neutral"
          onClick={handleClose}
          size="sm"
          sx={{ mr: 'auto' }}
        >
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
