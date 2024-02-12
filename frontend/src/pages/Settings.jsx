import UserContext from '@/components/UserContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

export default function Settings() {
  const context = useContext(UserContext);
  return <Navigate to={`/users/edit/${context.user.id}`} replace />;
}
