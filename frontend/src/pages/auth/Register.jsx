import { useState } from 'react';
import HorizontalFieldGroup from '@/components/joy/forms/HorizontalFieldGroup';
import SelectField from '@/components/joy/forms/SelectField';
import TextField from '@/components/joy/forms/TextField';
import {
  Button,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography as T,
  ModalDialog,
  Modal,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/joy';
import { useForm } from 'react-hook-form';
import { registerSchema } from '@/utils/formschema/users';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

// Icons
import OutboxIcon from '@mui/icons-material/Outbox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRegisterUser } from '@/hooks/query/users/useRegisterUser';
import { useCourses } from '@/hooks/query/courses/useCourses';
import { CardPage } from '@/components/layout/CardPage';

export default function Register() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { status: coursesStatus, data: coursesData } = useCourses();
  const registerMutation = useRegisterUser(() => setShowModal(true));

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: 'onBlur',
    resolver: yupResolver(registerSchema),
  });

  const handleClose = () => navigate('/auth/login');
  const onSubmit = async (newUser) => registerMutation.mutate(newUser);

  return (
    <>
      <CardPage title="Request Account" Icon={AccountCircleIcon}>
        <CardContent sx={{ gap: '0.5rem' }}>
          {coursesStatus === 'pending' ? (
            <LoadingSpinner />
          ) : (
            <form id="registerForm" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <HorizontalFieldGroup label="Name *">
                  {/* First name field */}
                  <TextField
                    name="first_name"
                    placeholder="First name"
                    control={control}
                  />
                  {/* Last name field */}
                  <TextField
                    name="last_name"
                    placeholder="Last name"
                    control={control}
                  />
                </HorizontalFieldGroup>
                {/* Email field */}
                <TextField
                  name="email"
                  label="Email *"
                  placeholder="yourname@academic.rrc.ca"
                  control={control}
                />
                {/* Password field */}
                <TextField
                  name="password"
                  type="password"
                  label="Password *"
                  helperText={
                    <span>
                      At least one uppercase letter, one lowercase letter, and
                      one number.
                    </span>
                  }
                  control={control}
                />
                {/* Confirm password field */}
                <TextField
                  name="confirmPassword"
                  type="password"
                  label="Confirm password *"
                  control={control}
                />
                {/* Section field */}
                <SelectField
                  name="courseId"
                  label="Section *"
                  placeholder="Select section"
                  options={coursesData.map((course) => {
                    return {
                      id: course.id,
                      label: `${course.name} ${course.term}${course.year}-${course.section}`,
                    };
                  })}
                  control={control}
                />
              </Stack>
            </form>
          )}
        </CardContent>
        <Divider />
        {coursesStatus !== 'pending' && (
          <CardActions>
            <Button
              type="submit"
              form="registerForm"
              variant="solid"
              color="primary"
              loading={isSubmitting}
              size="sm"
            >
              Request Account
            </Button>
          </CardActions>
        )}
      </CardPage>

      {/* Request Sent modal */}
      <Modal open={showModal}>
        <ModalDialog onClose={handleClose} size="sm">
          <DialogTitle>
            <OutboxIcon />
            Request Sent
          </DialogTitle>
          <DialogContent>
            <T textColor="text.tertiary">
              {`You'll receive an email once your account has been approved.`}
            </T>
            <DialogActions>
              <Button onClick={handleClose}>Okay</Button>
            </DialogActions>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
}
