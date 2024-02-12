import { FormControl, FormHelperText, FormLabel, Autocomplete } from '@mui/joy';
import { Controller } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AutocompleteField({
  name,
  label,
  helperText,
  options,
  multiple,
  onChangeFn,
  disabled,
  control,
  ...rest
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onBlur, onChange, value, ref },
        fieldState: { error },
        formState: { isSubmitting },
      }) => {
        return (
          <FormControl error={!!error} sx={{ height: '100%', flexGrow: 1 }}>
            {label && <FormLabel>{label}</FormLabel>}
            <Autocomplete
              size="sm"
              {...rest}
              name={name}
              value={multiple ? value || [] : value ?? null}
              multiple={multiple}
              options={options}
              disableCloseOnSelect={!!multiple}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onBlur={onBlur}
              onChange={(e, newValue, reason) => {
                onChange(newValue);
                if (onChangeFn) onChangeFn(e, newValue, reason);
              }}
              slotProps={{ input: { ref } }}
              disabled={isSubmitting || disabled}
            />
            <FormHelperText>
              {error ? (
                <>
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ alignSelf: 'start' }}
                  />
                  {error.message}
                </>
              ) : (
                helperText
              )}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
