import { Stack, DialogContent, DialogActions, Divider, Button } from '@mui/joy';
import { useParams } from 'react-router-dom';
import LabelText from '@/components/joy/LabelText';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { useCourse } from '@/hooks/query/courses/useCourse';
import NavigateParams from '@/components/NavigateParams';

export default function SectionView({ handleClose, closeTo }) {
  const { sectionId } = useParams();
  const { status, data } = useCourse(sectionId);

  if (status === 'pending') return <LoadingSpinner />;
  if (status === 'error') return <NavigateParams to={closeTo} />;

  return (
    <>
      <DialogContent>
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <LabelText label="Course">{data.name}</LabelText>
          <LabelText label="Term">{data.term}</LabelText>
          <LabelText label="Year">{data.year}</LabelText>
          <LabelText label="Section">{data.section}</LabelText>
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
