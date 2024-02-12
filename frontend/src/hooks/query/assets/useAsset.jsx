import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

// Retrieve
export function useAsset(assetId, courseId, enabled) {
  let endpoint = '';
  if (courseId === undefined || courseId === null || courseId.length == 0) {
    endpoint = `/api/assets/${assetId}/`;
  } else {
    endpoint = `/api/assets/section/${assetId}/?courseId=${courseId}/`;
  }
  return useQuery({
    queryKey: ['asset', assetId],
    queryFn: async () => {
      const asset = await Axios.get(endpoint).then((resp) => resp.data);
      return asset;
    },
    enabled: enabled,
  });
}

// Create Asset
export function useAddAsset(courseId, callbackFn) {
  const queryClient = useQueryClient();
  let endpoint = '';
  if (courseId === undefined || courseId === null || courseId.length == 0) {
    endpoint = '/api/assets/';
  } else {
    endpoint = `/api/assets/section/?courseId=${courseId}/`;
  }
  return useMutation({
    mutationFn: (data) => Axios.post(endpoint, data).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assets'] });
      if (callbackFn) callbackFn();
    },
  });
}

// Update Asset
export function useUpdateAsset(assetId, courseId, callbackFn) {
  const queryClient = useQueryClient();
  let endpoint = '';
  if (courseId === undefined || courseId === null || courseId.length == 0) {
    endpoint = `/api/assets/${assetId}/`;
  } else {
    endpoint = `/api/assets/section/${assetId}/?courseId=${courseId}/`;
  }
  return useMutation({
    mutationFn: (data) => Axios.patch(endpoint, data).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assets'] });
      await queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
      if (callbackFn) callbackFn();
    },
  });
}

// Delete Asset
export function useDeleteAsset(assetId, courseId, callbackFn) {
  const queryClient = useQueryClient();
  let endpoint = '';
  if (courseId === undefined || courseId === null || courseId.length == 0) {
    endpoint = `/api/assets/${assetId}/`;
  } else {
    endpoint = `/api/assets/section/${assetId}/?courseId=${courseId}/`;
  }
  return useMutation({
    mutationFn: () => Axios.delete(endpoint).then((resp) => resp.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assets'] });
      if (callbackFn) callbackFn();
    },
  });
}
