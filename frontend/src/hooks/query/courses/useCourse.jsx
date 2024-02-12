import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useCourse(sectionId, enabled) {
  return useQuery({
    queryKey: ['course', sectionId],
    queryFn: () =>
      Axios.get(`/api/courses-list/${sectionId}/`).then((resp) => resp.data),
    enabled: enabled,
  });
}

export function useAddCourse(callbackFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      Axios.post('/api/courses/', data).then((resp) => resp.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      if (callbackFn) callbackFn();
    },
  });
}

export function useUpdateCourse(sectionId, callbackFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionDelta) => {
      Axios.patch(`/api/courses/${sectionId}/`, sectionDelta).then(
        (resp) => resp.data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', sectionId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      if (callbackFn) callbackFn();
    },
  });
}

export function useDeleteCourse(sectionId, callbackFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      Axios.delete(`/api/courses/${sectionId}/`).then((resp) => resp.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', sectionId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      if (callbackFn) callbackFn();
    },
  });
}
