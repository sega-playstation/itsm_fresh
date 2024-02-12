import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography as T,
  Button,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/joy';
import TextField from '@/components/joy/forms/TextField';

// Icons
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { passwordSchema } from '@/utils/formschema/users';
import { useResetPassword } from '@/hooks/query/auth/useResetPassword';
import { CardPage } from '@/components/layout/CardPage';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [showModal, setShowModal] = useState(false);
  const resetPasswordMutation = useResetPassword(resetToken, () =>
    setShowModal(true)
  );

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: 'onBlur',
    resolver: yupResolver(passwordSchema),
  });

  const handleClose = () => navigate('/auth/login');
  const onSubmit = (data) => resetPasswordMutation.mutate(data.password);

  return (
    <>
      <CardPage title="Reset Password" Icon={LockResetIcon}>
        <CardContent sx={{ gap: '0.5rem' }}>
          <form id="emailForm" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <TextField
                name="password"
                type="password"
                label="Password"
                helperText={
                  <span>
                    At least one uppercase letter, one lowercase letter, and one
                    number.
                  </span>
                }
                control={control}
              />
              {/* Confirm password field */}
              <TextField
                name="confirmPassword"
                type="password"
                label="Confirm password"
                control={control}
              />
            </Stack>
          </form>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            type="submit"
            form="emailForm"
            variant="solid"
            color="primary"
            loading={isSubmitting}
            size="sm"
          >
            Save
          </Button>
        </CardActions>
      </CardPage>

      {/* Password Changed modal */}
      <Modal open={showModal}>
        <ModalDialog onClose={handleClose} size="sm">
          <DialogTitle>
            <CheckCircleIcon />
            Password Changed
          </DialogTitle>
          <DialogContent>
            <T textColor="text.tertiary">{`Your password has been changed.`}</T>
            <DialogActions>
              <Button onClick={handleClose}>Okay</Button>
            </DialogActions>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
}
