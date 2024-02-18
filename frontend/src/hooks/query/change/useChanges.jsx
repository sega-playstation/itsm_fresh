import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useAssets(courseId) {
  return useQuery({
    queryKey: ['assets', courseId ?? ''],
    queryFn: async () => {
      let endpoint = '';
      if (courseId) {
        endpoint = `/api/assets/section/?courseID=${courseId}`; // Any user
      } else {
        endpoint = '/api/assets/'; // Admin only
      }
      const users = await Axios.get(endpoint).then((resp) => resp.data);
      return users;
    },
  });
}
