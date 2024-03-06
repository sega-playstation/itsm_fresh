import axios from 'axios';
import {
  AutocompleteListbox,
  AutocompleteOption,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  ListItemContent,
  ListItemDecorator,
  Radio,
  Stack,
} from '@mui/joy';
import ModalTabs from '@/components/layout/ModalTabs';
// import { useForm } from 'react-hook-form';
// import LoadingSpinner from '@/components/layout/LoadingSpinner';
// import { yupResolver } from '@hookform/resolvers/yup';
//Changes made here to baseschema to fit changes
import { baseSchema } from '@/utils/formschema/changes';

// import { forwardRef, useContext, useEffect, useState } from 'react';

// import SelectField from '@/components/joy/forms/SelectField';
import TextareaField from '@/components/joy/forms/TextareaField';
import AutocompleteField from '@/components/joy/forms/AutocompleteField';
import RadioGroupField from '@/components/joy/forms/RadioGroupField';
import TextField from '@/components/joy/forms/TextField';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import NavigateParams from '@/components/NavigateParams';
import { useParams } from 'react-router-dom';
import {
  useAddChange,
  useChange,
  useUpdateChange,
} from '@/hooks/query/changes/useChange';
import UserContext from '@/components/UserContext';
import { UserRole, RequestType } from '@/utils/enums';
// import { RequestType, ChangeHistory, EnvironmentMaturity, DocumentationOfConfiguration, RequiredEmployees, BackOutPlanDifficulty, Duration } from '@/utils/enums';
import { cloneDeep, startCase, toLower } from 'lodash';
import { useChanges } from '@/hooks/query/changes/useChanges';
// import { useUsers } from '@/hooks/query/users/useUsers';

import React, { forwardRef, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUsers } from '@/hooks/query/users/useUsers'; // Assuming correct path
import SelectField from '@/components/joy/forms/SelectField';
import LoadingSpinner from '@/components/layout/LoadingSpinner';


// eslint-disable-next-line react/display-name
const Listbox = forwardRef((props, ref) => (
  <AutocompleteListbox
    ref={ref}
    {...props}
    size="sm"
    sx={{
      'marginTop': '0.5rem',
      'width': 'auto !important',
      'maxHeight': 'unset',
      'backgroundColor': 'var(--joy-palette-background-surface)',
      'boxShadow':
        'var(--joy-shadowRing, 0 0 #000),0px 1px 2px 0px rgba(var(--joy-shadowChannel, 21 21 21) / var(--joy-shadowOpacity, 0.08))',
      '& .MuiListSubheader-root': {
        backgroundColor: 'var(--joy-palette-background-surface)',
      },
    }}
  />
));



export default function ChangeForm({ type, color, handleClose, closeTo }) {
  const { user, selectedCourse } = useContext(UserContext);
  const { changeId } = useParams();
  const { status: changesStatus, data: changesData } = useChanges(
    user.roleId !== UserRole.ADMIN ? selectedCourse : undefined,
  );
  const { status: changeStatus, data: changeData } = useChange(
    changeId,
    selectedCourse,
    type === 'update',
  );

  const { status: usersStatus, data: usersData, error: usersError } = useUsers('all');
  console.log(usersData);

  // const userOptions = usersData ? usersData.map(user => ({
  //   id: user.id,
  //   label: `${user.first_name} ${user.last_name}`,
  // })) : [];

  const updateChange = useUpdateChange(changeId, selectedCourse, handleClose);
  const addChange = useAddChange(selectedCourse, handleClose);



  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    shouldFocusError: true,
    mode: 'onBlur',
    resolver: yupResolver(baseSchema),
  });


  const onSubmit = async (data) => {
    const shapedData = cloneDeep(data);
    if (shapedData.change_dependencies) {
      shapedData.change_dependencies = data.change_dependencies.map(
        (dependency) => dependency.id,
      );
    }



    if (type === 'update') {
      return updateChange.mutateAsync(shapedData);
    } else {
      return addChange.mutateAsync(shapedData);
    }
  };



  useEffect(() => {
    if (!changeData) return;
    reset({
      ...changeData,
      change_dependencies: changeData.change_dependencies.map((change) => ({
        id: change,
      })),
    });
  }, [reset, changeData]);

  if (
    (type === 'update' && changeStatus === 'pending') ||
    changesStatus === 'pending'
  )
    return <LoadingSpinner />;
  if (
    (type === 'update' && changeStatus === 'error') ||
    changesStatus === 'error'
  )
    return <NavigateParams to={closeTo} />;

  // Organize by type, sort within that type by ID
  let options = [...changesData];
  if (type === 'update') {
    options = options.filter((change) => change.id !== changeData.id);
  }




  const sortedOptions = options.sort(
    (a, b) => a.category === b.category || a.dateAdded - b.dateAdded,
  );



  if (usersStatus === 'loading') {
    return <LoadingSpinner />; // Ensure you have a LoadingSpinner component or use any loading indicator
  }

  if (usersStatus === 'error') {
    console.error(usersError);
    return <div>Error loading users.</div>;
  }


  const userOptions = usersData ? usersData.map(user => ({
    id: user.id,
    label: `${user.first_name} ${user.last_name}`, // Use the correct property names
  })) : [];




  return (
    <>
      <DialogContent sx={{ padding: '0 !important' }}>
        <form
          id="modalForm"
          onSubmit={handleSubmit(onSubmit)}
          style={{ height: '100%' }}
        >
          <ModalTabs errors={errors}>
            <ModalTabs.Tab label="Change Request Details">
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <SelectField
                  name="Change Request Type"
                  label="Change Request Type *"
                  options={Object.entries(RequestType).map(([key, value]) => ({
                    id: value,
                    label: startCase(toLower(key)),
                  }))}
                  control={control}
                />
                <TextField
                  name="request_name"
                  label="Change Request Name *"
                  control={control}
                />
                <SelectField
                  name="assigned_technician"
                  label="Assigned Technician *"
                  options={userOptions}
                  control={control} // assuming you're using react-hook-form
                />
                <SelectField
                  name="requested_by"
                  label="Requested By *"
                  options={userOptions}
                  control={control} // assuming you're using react-hook-form
                />
                <TextField
                  name="request_contact"
                  label="Request Contact"
                  control={control}
                />
              </Stack>
            </ModalTabs.Tab>
            <ModalTabs.Tab label="Risk Assessment">
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <TextField
                  name="vendor_name"
                  label="Vendor Name"
                  control={control}
                />
                <TextField
                  name="product_name"
                  label="Product Name"
                  control={control}
                />
                <TextField
                  name="current_version"
                  label="Current Version"
                  control={control}
                />
                <TextField
                  name="license_name"
                  label="License Name"
                  control={control}
                />
                <TextField
                  name="license_type"
                  label="License Type"
                  control={control}
                />
                <RadioGroupField
                  name="vendor_support"
                  label="Vendor Support"
                  orientation="horizontal"
                  control={control}
                >
                  <Radio value="true" label="Yes" />
                  <Radio value="false" label="No" />
                </RadioGroupField>
                <TextField
                  name="license_cost"
                  label="License Cost"
                  type="number"
                  control={control}
                />
              </Stack>
            </ModalTabs.Tab>
            <ModalTabs.Tab label="Dependencies">
              <AutocompleteField
                name="change_dependencies"
                label="Changes"
                startDecorator={<SearchIcon />}
                placeholder="Filter Changes"
                noOptionsText="No changes"
                open
                multiple
                slots={{ listbox: Listbox }}
                options={sortedOptions}
                getOptionLabel={(option) => option.change_name}
                groupBy={(option) => option.category}
                renderTags={() => null}
                renderOption={(props, option, { selected }) => (
                  <AutocompleteOption {...props}>
                    <ListItemDecorator>
                      {selected ? (
                        <CheckBoxIcon />
                      ) : (
                        <CheckBoxOutlineBlankIcon />
                      )}
                    </ListItemDecorator>
                    <ListItemContent sx={{ fontSize: 'sm' }}>
                      {option.change_name}
                    </ListItemContent>
                  </AutocompleteOption>
                )}
                forcePopupIcon={false}
                control={control}
                sx={{
                  '& .MuiAutocomplete-wrapper': {
                    '--Autocomplete-wrapperGap': 0,
                  },
                }}
              />
            </ModalTabs.Tab>
          </ModalTabs>
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
