import * as yup from 'yup';

export const baseSchema = yup.object({
  change_name: yup
    .string()
    .required('Change name is required.')
    .max(100, 'Change name cannot exceed 100 characters'),
  serial_number: yup
    .string()
    .required('Serial number is required.')
    .max(100, 'Serial number cannot exceed 100 characters.'),
  category: yup.string().required('Category is required.'),
  status: yup.number().required('Status is required.'),
  location: yup
    .string()
    .required('Location is required')
    .max(100, 'Location cannot exceed 100 characters.'),
  ip_address: yup
    .string()
    .nullable(true)
    .max(100, 'IP address cannot exceed 100 characters.'),
  description: yup
    .string()
    .nullable(true)
    .max(100, 'Description cannot exceed 100 characters.'),
  vendor_name: yup
    .string()
    .nullable(true)
    .max(100, 'Vendor name cannot exceed 100 characters'),
  product_name: yup
    .string()
    .nullable(true)
    .max(100, 'Product name cannot exceed 100 characters'),
  current_version: yup
    .string()
    .nullable(true)
    .max(100, 'Current version cannot exceed 100 characters'),
  license_name: yup
    .string()
    .nullable(true)
    .max(100, 'License name cannot exceed 100 characters'),
  license_type: yup
    .string()
    .nullable(true)
    .max(100, 'License type cannot exceed 100 characters'),
  vendor_support: yup.boolean().nullable(true),
  license_cost: yup.number().nullable(true),
  change_dependencies: yup.array().nullable(true),
});
