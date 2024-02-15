import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

// Retrieve
export function useChange(changeId, courseId, enabled) {
  let endpoint = '';
  if (courseId === undefined || courseId === null || courseId.length == 0) {
    endpoint = `/api/change/${changeId}/`;
  } else {
    endpoint = `/api/change/section/${changeId}/?courseId=${courseId}/`;
  }
  return useQuery({
    queryKey: ['change', changeId],
    queryFn: async () => {
      const change = await Axios.get(endpoint).then((resp) => resp.data);
      return change;
    },
    enabled: enabled,
  });
}

// Create Change
export function useAddChange(courseId, callbackFn) {
  const queryClient = useQueryClient();
  let endpoint = '';
  if (courseId === undefined || courseId === null || courseId.length == 0) {
    endpoint = '/api/change/';
  } else {
    endpoint = `/api/change/section/?courseId=${courseId}/`;
  }
  return useMutation({
    mutationFn: (data) => Axios.post(endpoint, data).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['change'] });
      if (callbackFn) callbackFn();
    },
  });
}

// Update Change
export function useUpdateChange(changeId, courseId, callbackFn) {
  const queryClient = useQueryClient();
  let endpoint = '';
  if (courseId === undefined || courseId === null || courseId.length == 0) {
    endpoint = `/api/change/${chnageId}/`;
  } else {
    endpoint = `/api/change/section/${changeId}/?courseId=${courseId}/`;
  }
  return useMutation({
    mutationFn: (data) => Axios.patch(endpoint, data).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['change'] });
      await queryClient.invalidateQueries({ queryKey: ['change', changeId] });
      if (callbackFn) callbackFn();
    },
  });
}

// Delete Change
export function useDeleteChange(changeId, courseId, callbackFn) {
  const queryClient = useQueryClient();
  let endpoint = '';
  if (courseId === undefined || courseId === null || courseId.length == 0) {
    endpoint = `/api/change/${changeId}/`;
  } else {
    endpoint = `/api/change/section/${changeId}/?courseId=${courseId}/`;
  }
  return useMutation({
    mutationFn: () => Axios.delete(endpoint).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['change'] });
      if (callbackFn) callbackFn();
    },
  });
}