import { FormControl, FormHelperText, Checkbox } from '@mui/joy';
import { Controller } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function CheckboxField({
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
          <Checkbox
            size="sm"
            {...rest}
            name={name}
            label={label}
            checked={!!value}
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
