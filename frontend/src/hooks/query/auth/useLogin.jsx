import { useMutation } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';
import { SetAccessToken, SetRefreshToken } from '@/utils/TokenManager';
import jwtDecode from 'jwt-decode';
import { useContext } from 'react';
import UserContext from '@/components/UserContext';

export default function useLogin(callbackFn) {
  const context = useContext(UserContext);
  return useMutation({
    mutationFn: async (data) => {
      try {
        const resp = await Axios.post('/api/token', data);
        return resp.data;
      } catch (error) {
        if (error?.response?.status === 401) {
          throw Error('Invalid username or password. Please try again.');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      const storageType = data.rememberMe ? localStorage : sessionStorage;
      const token = jwtDecode(data.refresh);
      SetAccessToken(storageType, data.access);
      SetRefreshToken(storageType, data.refresh);

      context.setUser({
        id: token.user_id,
        ...token.sub,
      });
      context.setSelectedCourse(token.sub.courseId[0]);
      context.setLoaded(true);

      if (callbackFn) callbackFn();
    },
  });
}
