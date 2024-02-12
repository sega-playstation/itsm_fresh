import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useUser(userId, enabled) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const user = await Axios.get(`/api/users/${userId}/`).then(
        (resp) => resp.data,
      );
      return user;
    },
    enabled: enabled,
  });
}

export function useAddUser(callbackFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      Axios.post('/api/users/', data).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      if (callbackFn) callbackFn();
    },
  });
}

export function useUpdateUser(userId, callbackFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      Axios.patch(`/api/users/${userId}/`, data).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries({ queryKey: ['user', userId] });
      if (callbackFn) callbackFn();
    },
  });
}

export function useDeleteUser(userId, callbackFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      Axios.delete(`/api/users/${userId}/`).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      if (callbackFn) callbackFn();
    },
  });
}
