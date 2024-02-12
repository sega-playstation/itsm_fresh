import { useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import UserContext from '../../components/UserContext';
import { ClearTokens } from '../../utils/TokenManager';

import { CardContent, Link, Typography as T } from '@mui/joy';
import { Lock } from '@mui/icons-material';
import { CardPage } from '@/components/layout/CardPage';

export default function Logout() {
  const context = useContext(UserContext);

  useEffect(() => {
    context.reset();
    ClearTokens();
  }, []);

  return (
    <CardPage title="Logged Out" Icon={Lock}>
      <CardContent>
        <T>
          You have been logged out. Would you like to{' '}
          <Link component={RouterLink} to="/auth/login">
            login again?
          </Link>
        </T>
      </CardContent>
    </CardPage>
  );
}
