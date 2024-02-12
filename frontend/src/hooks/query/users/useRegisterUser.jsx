import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useRegisterUser(callbackFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUser) =>
      Axios.post('/api/create_account/', {
        ...newUser,
        role_id: 4,
        courseId: Array.isArray(newUser.courseId)
          ? newUser.courseId
          : [newUser.courseId],
      }).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      if (callbackFn) callbackFn();
    },
  });
}
