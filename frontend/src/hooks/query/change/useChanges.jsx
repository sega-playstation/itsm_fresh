import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useChange(courseId) {
  return useQuery({
    queryKey: ['change', courseId ?? ''],
    queryFn: async () => {
      let endpoint = '';
      if (courseId) {
        endpoint = `/api/change/section/?courseID=${courseId}`; // Any user
      } else {
        endpoint = '/api/change/'; // Admin only
      }
      const users = await Axios.get(endpoint).then((resp) => resp.data);
      return users;
    },
  });
}
