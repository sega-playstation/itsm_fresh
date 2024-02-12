import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => Axios.get('/api/roles/').then((resp) => resp.data),
  });
}
