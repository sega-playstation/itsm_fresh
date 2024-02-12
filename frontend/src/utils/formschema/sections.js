import * as yup from 'yup';

export const schema = yup.object({
  name: yup
    .string()
    .required('Name is required.')
    .max(100, 'Name must not exceed 100 characters.'),
  term: yup
    .string()
    .required('Term is required.')
    .max(10, 'Term must not exceed 10 characters.'),
  year: yup.number().required('Year is required.'),
  section: yup.number().required('Section is required.'),
});
