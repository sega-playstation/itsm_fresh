import TextField from '@/components/joy/forms/TextField';
import HorizontalFieldGroup from '@/components/joy/forms/HorizontalFieldGroup';
import SelectField from '@/components/joy/forms/SelectField';
import AutocompleteField from '@/components/joy/forms/AutocompleteField';
import { DialogContent, Divider, DialogActions, Stack, Button } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createSchema, updateSchema } from '@/utils/formschema/users';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { useEffect } from 'react';
import {
  useAddUser,
  useUpdateUser,
  useUser,
} from '@/hooks/query/users/useUser';
import { useCourses } from '@/hooks/query/courses/useCourses';
import { useRoles } from '@/hooks/query/useRoles';
import { UserRole } from '@/utils/enums';
import { cloneDeep } from 'lodash';
import NavigateParams from '@/components/NavigateParams';

export default function UserForm({ type, color, handleClose, closeTo }) {
  const { userId } = useParams();
  const { status: userStatus, data: userData } = useUser(
    userId,
    type === 'update',
  );
  const { status: rolesStatus, data: rolesData } = useRoles();
  const { status: coursesStatus, data: coursesData } = useCourses();
  const updateUser = useUpdateUser(userId, handleClose);
  const addUser = useAddUser(handleClose);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: 'onBlur',
    resolver: yupResolver(type === 'update' ? updateSchema : createSchema),
  });

  const roleWatch = watch('role_id');

  // TODO: only submit dirty fields on submit
  const onSubmit = async (data) => {
    // Backend wants nothing for ADMIN and an array of UUIDs for other users
    const shapedData = cloneDeep(data);
    if (data.role_id === UserRole.ADMIN) {
      delete shapedData.courseId;
    } else {
      shapedData.courseId = data.courseId.map((course) => course.id);
    }

    if (type === 'update') {
      return updateUser.mutateAsync(shapedData);
    } else if (type === 'create') {
      return addUser.mutateAsync(shapedData);
    }
  };

  // Populate form with existing values once API call has resolved
  useEffect(() => {
    if (!userData) return;
    reset({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      role_id: userData.role_id,
      courseId: userData.course_details.map((course) => ({
        ...course,
        label: `${course.term}${course.year}-${course.section}`,
      })),
    });
  }, [reset, userData]);

  if (
    rolesStatus === 'pending' ||
    coursesStatus === 'pending' ||
    (type === 'update' && userStatus === 'pending')
  ) {
    return <LoadingSpinner />;
  }

  if (
    rolesStatus === 'error' ||
    coursesStatus === 'error' ||
    (type === 'update' && userStatus === 'error')
  ) {
    return <NavigateParams to={closeTo} />;
  }

  return (
    <>
      <DialogContent>
        <form id="modalForm" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <HorizontalFieldGroup label="Name *">
              {/* First name field */}
              <TextField
                name="first_name"
                placeholder="First name"
                control={control}
              />
              {/* Last name field */}
              <TextField
                name="last_name"
                placeholder="Last name"
                control={control}
              />
            </HorizontalFieldGroup>
            {/* Email field */}
            <TextField
              name="email"
              label="Email *"
              placeholder="yourname@academic.rrc.ca"
              control={control}
            />
            {/* Password field */}
            {type === 'create' && (
              <>
                <TextField
                  name="password"
                  type="password"
                  label="Password *"
                  helperText={
                    <span>
                      Passwords must meet{' '}
                      <a
                        href="https://www.rrc.ca/its/help-resources/passwords/create-a-strong-password/"
                        tabIndex="-1"
                      >
                        RRC password requirements.
                      </a>
                    </span>
                  }
                  control={control}
                />
                {/* Confirm password field */}
                <TextField
                  name="confirmPassword"
                  type="password"
                  label="Confirm password *"
                  control={control}
                />
              </>
            )}
            {/* Role field */}
            <SelectField
              name="role_id"
              label="Role *"
              placeholder="Select role"
              options={rolesData.map((role) => {
                return { id: role.roleId, label: role.name };
              })}
              control={control}
            />
            {/* Section field */}
            {/* TODO: Only allow multiple sections for instructors */}
            <AutocompleteField
              name="courseId"
              label="Section *"
              placeholder="Select section"
              options={coursesData.map((course) => {
                return {
                  id: course.id,
                  label: `${course.term}${course.year}-${course.section}`,
                };
              })}
              multiple
              disabled={roleWatch === UserRole.ADMIN}
              control={control}
            />
          </Stack>
        </form>
      </DialogContent>
      <Divider inset="context" />
      <DialogActions>
        <Button
          type="submit"
          form="modalForm"
          variant="solid"
          color={color}
          loading={isSubmitting}
          size="sm"
        >
          {type === 'create' && 'Create'}
          {type === 'update' && 'Edit'}
        </Button>
        <Button variant="plain" color="neutral" onClick={handleClose} size="sm">
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
