import UserContext from '@/components/UserContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthenticatedRoutes() {
  const { user, isLoaded } = useContext(UserContext);

  if (!isLoaded) return <></>;

  return user !== null ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
