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
import { useForm } from 'react-hook-form';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { yupResolver } from '@hookform/resolvers/yup';
import { baseSchema } from '@/utils/formschema/assets';
import { forwardRef, useContext, useEffect } from 'react';
import SelectField from '@/components/joy/forms/SelectField';
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
  useAddAsset,
  useAsset,
  useUpdateAsset,
} from '@/hooks/query/assets/useAsset';
import UserContext from '@/components/UserContext';
import { AssetCategory, AssetStatus, UserRole } from '@/utils/enums';
import { cloneDeep, startCase, toLower } from 'lodash';
import { useAssets } from '@/hooks/query/assets/useAssets';

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

export default function AssetForm({ type, color, handleClose, closeTo }) {
  const { user, selectedCourse } = useContext(UserContext);
  const { assetId } = useParams();
  const { status: assetsStatus, data: assetsData } = useAssets(
    user.roleId !== UserRole.ADMIN ? selectedCourse : undefined,
  );
  const { status: assetStatus, data: assetData } = useAsset(
    assetId,
    selectedCourse,
    type === 'update',
  );
  const updateAsset = useUpdateAsset(assetId, selectedCourse, handleClose);
  const addAsset = useAddAsset(selectedCourse, handleClose);

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
    if (shapedData.asset_dependencies) {
      shapedData.asset_dependencies = data.asset_dependencies.map(
        (dependency) => dependency.id,
      );
    }

    if (type === 'update') {
      return updateAsset.mutateAsync(shapedData);
    } else {
      return addAsset.mutateAsync(shapedData);
    }
  };

  useEffect(() => {
    if (!assetData) return;
    reset({
      ...assetData,
      asset_dependencies: assetData.asset_dependencies.map((asset) => ({
        id: asset,
      })),
    });
  }, [reset, assetData]);

  if (
    (type === 'update' && assetStatus === 'pending') ||
    assetsStatus === 'pending'
  )
    return <LoadingSpinner />;
  if (
    (type === 'update' && assetStatus === 'error') ||
    assetsStatus === 'error'
  )
    return <NavigateParams to={closeTo} />;

  // Organize by type, sort within that type by ID
  let options = [...assetsData];
  if (type === 'update') {
    options = options.filter((asset) => asset.id !== assetData.id);
  }

  const sortedOptions = options.sort(
    (a, b) => a.category === b.category || a.dateAdded - b.dateAdded,
  );

  return (
    <>
      <DialogContent sx={{ padding: '0 !important' }}>
        <form
          id="modalForm"
          onSubmit={handleSubmit(onSubmit)}
          style={{ height: '100%' }}
        >
          <ModalTabs errors={errors}>
            <ModalTabs.Tab label="General">
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <TextField
                  name="asset_name"
                  label="Asset Name *"
                  control={control}
                />
                <TextField
                  name="serial_number"
                  label="Serial Number *"
                  control={control}
                />
                <SelectField
                  name="category"
                  label="Category *"
                  options={Object.entries(AssetCategory).map(
                    ([key, value]) => ({
                      id: value,
                      label: startCase(toLower(key)),
                    }),
                  )}
                  control={control}
                />
                <SelectField
                  name="status"
                  label="Status *"
                  options={Object.entries(AssetStatus).map(([key, value]) => ({
                    id: value,
                    label: startCase(toLower(key)),
                  }))}
                  control={control}
                />
                <TextField
                  name="location"
                  label="Location *"
                  control={control}
                />
                <TextField
                  name="ip_address"
                  label="IP Address"
                  control={control}
                />
                <TextareaField
                  name="description"
                  label="Description"
                  minRows={3}
                  control={control}
                />
              </Stack>
            </ModalTabs.Tab>
            <ModalTabs.Tab label="License">
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
                name="asset_dependencies"
                label="Assets"
                startDecorator={<SearchIcon />}
                placeholder="Filter assets"
                noOptionsText="No assets"
                open
                multiple
                slots={{ listbox: Listbox }}
                options={sortedOptions}
                getOptionLabel={(option) => option.asset_name}
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
                      {option.asset_name}
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
