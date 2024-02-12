import { useMutation } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useResetPassword(resetToken, callbackFn) {
  return useMutation({
    mutationFn: (newPassword) =>
      Axios.post('/api/reset_password/', {
        resetId: resetToken,
        password: newPassword,
      }).then((resp) => resp.data),
    onSuccess: async () => {
      if (callbackFn) callbackFn();
    },
  });
}
