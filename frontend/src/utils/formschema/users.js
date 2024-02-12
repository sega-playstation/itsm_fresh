import * as yup from 'yup';
import { UserRole } from '../enums';

export const baseSchema = yup.object({
  first_name: yup
    .string()
    .required('First name is required.')
    .max(100, 'Name must not exceed 100 characters.')
    .matches(
      /^[A-Za-z\s\-]+$/,
      'Name can only contain letters, hyphens, and spaces.',
    ), // Regex from ChatGPT
  last_name: yup
    .string()
    .required('Last name is required.')
    .max(100, 'Name must not exceed 100 characters.'),
  email: yup
    .string()
    .required('Email is required.')
    .max(100, 'Email must not exceed 100 characters.')
    .email('Enter a valid email.'),
});

export const passwordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password must not exceed 100 characters.')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    ), // Regex from ChatGPT
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match.')
    .required('Password is required.'),
});

// Register inherits from baseSchema and passwordSchema
export const registerSchema = baseSchema.concat(passwordSchema).concat(
  yup.object({
    courseId: yup.string().required('Section is required.'),
  }),
);

// Update inherits from baseSchema
export const updateSchema = baseSchema.concat(
  yup.object({
    role_id: yup.number().required('Role is required.'),
    courseId: yup
      .array()
      .test('courseId', 'Section is required.', function (value) {
        const { role_id } = this.parent;
        if (role_id === UserRole.ADMIN) return true;
        return value !== undefined;
      }),
  }),
);

// Create inherits from baseSchema, passwordSchema, and updateSchema
export const createSchema = baseSchema
  .concat(passwordSchema)
  .concat(updateSchema);
