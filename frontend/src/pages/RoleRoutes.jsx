import UserContext from '@/components/UserContext';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import NoMatch from './NoMatch';

export default function RoleRoutes({ allowedRoles }) {
  const { user, isLoaded } = useContext(UserContext);

  if (!isLoaded) return false;

  return user !== null && allowedRoles.includes(user.roleId) ? (
    <Outlet />
  ) : (
    <NoMatch />
  );
}
