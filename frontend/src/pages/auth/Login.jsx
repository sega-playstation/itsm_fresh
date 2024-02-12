import {
  Button,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography as T,
} from '@mui/joy';
import CheckboxField from '@/components/joy/forms/CheckboxField';
import TextField from '@/components/joy/forms/TextField';
import { CardPage } from '@/components/layout/CardPage';
import useLogin from '@/hooks/query/auth/useLogin';
import KeyIcon from '@mui/icons-material/Key';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const params = useSearchParams();
  const loginMutation = useLogin(() => {
    if (params[0].has('redirect')) {
      navigate(params[0].get('redirect'));
    } else {
      navigate('/');
    }
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object({
        email: yup.string().required('Email is required.'),
        password: yup.string().required('Password is required.'),
      })
    ),
  });

  const onSubmit = (data) =>
    loginMutation.mutateAsync(data).catch(() => {
      // Do nothing. Error handling is already done by RQ.
    });

  return (
    <CardPage title="Login" Icon={KeyIcon}>
      <CardContent>
        <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <TextField name="email" label="Email" control={control} />
            <TextField
              name="password"
              type="password"
              label="Password"
              control={control}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ marginTop: '0.5rem !important' }}
            >
              <CheckboxField
                name="rememberMe"
                label="Remember Me"
                control={control}
                sx={{ flexGrow: '0 !important' }}
              />
              <Link to="/auth/forgot">Forgot Password</Link>
            </Stack>
          </Stack>
        </form>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          type="submit"
          form="loginForm"
          color="primary"
          loading={isSubmitting}
        >
          Login
        </Button>
      </CardActions>
      <T level="body-sm">
        {`Don't have an account? `}
        <Link to="/auth/register">Request Account</Link>
      </T>
    </CardPage>
  );
}
