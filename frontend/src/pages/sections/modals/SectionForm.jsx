import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Radio,
  Stack,
} from '@mui/joy';
import TextField from '@/components/joy/forms/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@/utils/formschema/sections';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import {
  useAddCourse,
  useCourse,
  useUpdateCourse,
} from '@/hooks/query/courses/useCourse';
import NavigateParams from '@/components/NavigateParams';
import RadioGroupField from '@/components/joy/forms/RadioGroupField';

export default function SectionForm({ type, color, handleClose, closeTo }) {
  const { sectionId } = useParams();
  const { status, data } = useCourse(sectionId, type === 'update');
  const updateSection = useUpdateCourse(sectionId, handleClose);
  const addSection = useAddCourse(handleClose);
  const currentYear = new Date().getFullYear();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  // TODO: only submit dirtyFields
  const onSubmit = (data) => {
    if (type === 'update') {
      return updateSection.mutateAsync(data);
    } else if (type === 'create') {
      return addSection.mutateAsync(data);
    }
  };

  // Populate form with existing values once API call has resolved
  useEffect(() => {
    if (status !== 'success') return;
    reset(data);
  }, [reset, status, data]);

  if (type === 'update' && status === 'pending') return <LoadingSpinner />;
  if (type === 'update' && status === 'error')
    return <NavigateParams to={closeTo} />;

  return (
    <>
      <DialogContent>
        <form id="modalForm" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <TextField name="name" label="Name *" control={control} />
            <RadioGroupField
              name="term"
              label="Term *"
              orientation="vertical"
              control={control}
            >
              <Radio value="WI" label="Winter" />
              <Radio value="SP" label="Spring" />
              <Radio value="FA" label="Fall" />
            </RadioGroupField>
            <RadioGroupField
              name="year"
              label="Year *"
              orientation="horizontal"
              control={control}
            >
              {[currentYear, currentYear + 1].map((year) => (
                <Radio key={year} value={year} label={year} />
              ))}
            </RadioGroupField>
            <TextField name="section" label="Section *" control={control} />
          </Stack>
        </form>
      </DialogContent>
      <Divider inset="context" />
      <DialogActions>
        <Button
          type="submit"
          form="modalForm"
          variant="solid"
          color={color}
          loading={isSubmitting}
          size="sm"
        >
          {type === 'create' && 'Create'}
          {type === 'update' && 'Edit'}
        </Button>
        <Button variant="plain" color="neutral" onClick={handleClose} size="sm">
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
