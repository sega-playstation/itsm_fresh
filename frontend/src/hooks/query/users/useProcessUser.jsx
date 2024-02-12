import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useProcessUser(callbackFn) {
  const queryClient = useQueryClient();
  return useMutation({
    // decision can be 'approve' or 'reject'
    mutationFn: ({ userId, decision }) => {
      Axios.post(`/api/account_approval/${userId}/`, {
        response: decision,
      }).then((resp) => resp.data);
    },
    onSuccess: async (data, { userId }) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries({ queryKey: ['user', userId] });
      if (callbackFn) callbackFn();
    },
  });
}
