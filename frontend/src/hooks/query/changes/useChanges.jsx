import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useChanges(courseId) {
  return useQuery({
    queryKey: ['changes', courseId ?? ''],
    queryFn: async () => {
      let endpoint = '';
      if (courseId) {
        endpoint = `/api/changes/section/?courseID=${courseId}`; // Any user
      } else {
        endpoint = '/api/changes/'; // Admin only
      }
      const users = await Axios.get(endpoint).then((resp) => resp.data);
      return users;
    },
  });
}
