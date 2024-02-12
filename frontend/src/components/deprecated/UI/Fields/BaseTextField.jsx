import { TextField } from "@mui/material";

export default function BaseTextField({
  label,
  name,
  value,
  variant,
  required,
  handleChange,
}) {
  /**
   * Handles change event when incident ticket field are change
   */
  const handleChangeField = (event) => {
    const value = event.target.value;
    handleChange({ [name]: value });
  };

  return (
    <>
      <TextField
        required={required ? required : false}
        id={name}
        label={label}
        variant={variant}
        fullWidth
        name={name}
        onChange={handleChangeField}
        value={value}
        inputProps={{ maxLength: 100 }}
      />
    </>
  );
}
