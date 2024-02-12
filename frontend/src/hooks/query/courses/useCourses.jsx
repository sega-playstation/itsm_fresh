import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => Axios.get('/api/courses-list/').then((resp) => resp.data),
  });
}
