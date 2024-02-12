import { FormControl, FormHelperText, FormLabel, Switch } from '@mui/joy';
import { Controller } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function SwitchField({
  name,
  label,
  helperText,
  disabled,
  control,
  ...rest
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { name, value, onBlur, onChange, ref },
        fieldState: { error },
        formState: { isSubmitting },
      }) => (
        <FormControl
          orientation="horizontal"
          error={!!error}
          sx={{ flexGrow: 1, alignItems: 'start' }}
        >
          {label && <FormLabel>{label}</FormLabel>}
          <Switch
            size="md"
            {...rest}
            name={name}
            checked={value ?? false}
            onBlur={onBlur}
            onChange={onChange}
            slotProps={{ input: { ref } }}
            disabled={isSubmitting || disabled}
            sx={{ marginLeft: '0 !important' }}
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
      )}
    />
  );
}
