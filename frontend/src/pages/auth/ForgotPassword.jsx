import { useState } from 'react';
import {
  Button,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  Divider,
  CardContent,
  CardActions,
  Typography as T,
} from '@mui/joy';
import TextField from '@/components/joy/forms/TextField';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Icons
import OutboxIcon from '@mui/icons-material/Outbox';
import MailLockIcon from '@mui/icons-material/MailLock';
import { useForgotPassword } from '@/hooks/query/auth/useForgotPassword';
import { CardPage } from '@/components/layout/CardPage';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const forgotPasswordMutation = useForgotPassword(() => setShowModal(true));

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object({
        email: yup
          .string()
          .required('Email is required.')
          .max(100, 'Email must not exceed 100 characters.')
          .email('Enter a valid email.'),
      })
    ),
  });

  const handleClose = () => navigate('/auth/login');
  const onSubmit = async (data) => forgotPasswordMutation.mutate(data.email);

  return (
    <>
      <CardPage title="Forgot Password" Icon={MailLockIcon}>
        <CardContent sx={{ gap: '0.5rem' }}>
          <form id="emailForm" onSubmit={handleSubmit(onSubmit)}>
            <TextField name="email" label="Email" control={control} />
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
            Send
          </Button>
        </CardActions>
      </CardPage>

      {/* Email Sent modal */}
      <Modal open={showModal} onClose={handleClose}>
        <ModalDialog>
          <DialogTitle>
            <OutboxIcon />
            Request Sent
          </DialogTitle>
          <DialogContent>
            <T textColor="text.tertiary">
              An email has been sent to your address with a password reset link.
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
