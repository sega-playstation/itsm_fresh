import {
  FormControl,
  FormHelperText,
  FormLabel,
  Option,
  Select,
} from '@mui/joy';
import { Controller } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function SelectField({
  name,
  label,
  helperText,
  options,
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
      }) => (
        <FormControl error={!!error} sx={{ flexGrow: 1 }}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            size="sm"
            {...rest}
            name={name}
            value={value ?? null}
            onBlur={onBlur}
            onChange={(e, newValue) => onChange(newValue)}
            slotProps={{ input: { ref } }}
            disabled={isSubmitting || disabled}
          >
            {options.map((item) => (
              <Option key={`option-${item.id}`} value={item.id}>
                {item.label}
              </Option>
            ))}
          </Select>
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
