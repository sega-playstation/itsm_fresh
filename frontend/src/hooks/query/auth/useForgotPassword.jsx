import { useMutation } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useForgotPassword(callbackFn) {
  return useMutation({
    mutationFn: (email) =>
      Axios.post('/api/forget_password/', {
        email: email,
      }).then((resp) => resp.data),
    onSuccess: async () => {
      if (callbackFn) callbackFn();
    },
  });
}
