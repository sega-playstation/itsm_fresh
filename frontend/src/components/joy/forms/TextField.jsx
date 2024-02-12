import { FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import { Controller } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function TextField({
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
        <FormControl error={!!error} sx={{ flexGrow: 1 }}>
          {label && <FormLabel>{label}</FormLabel>}
          <Input
            size="sm"
            {...rest}
            name={name}
            value={value ?? ''}
            onBlur={onBlur}
            onChange={onChange}
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
      )}
    />
  );
}
