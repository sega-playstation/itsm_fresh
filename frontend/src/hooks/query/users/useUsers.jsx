import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/utils/Axios';

/**
 *
 * @param {'all' | 'unapproved'} type
 * @param {*} [courseId]
 * @returns
 */
export function useUsers(type, courseId) {
  return useQuery({
    queryKey: ['users', type, courseId ?? ''],
    queryFn: async () => {
      let endpoint = '';
      if (type === 'all') {
        if (courseId) {
          endpoint = `/api/limited_users/classlist/${courseId}/`; // Any user
        } else {
          endpoint = '/api/users/'; // Admin only
        }
      } else if (type === 'unapproved') {
        endpoint = `/api/unapproved_users/`; // Admin only
      }

      const users = await Axios.get(endpoint).then((resp) => resp.data);
      const roles = await Axios.get('/api/roles-list/').then(
        (resp) => resp.data
      );
      const courses = await Axios.get('/api/courses-list/').then(
        (resp) => resp.data
      );
      return users;
    },
  });
}
