import { TextField } from "@mui/material";

export default function BaseTextField2({
  label,
  name,
  value,
  variant,
  placeholder,
  handleChange,
}) {
  /**
   * Handles change event when incident ticket field are change
   */
  function handleChangeField(event) {
    const value = event.target.value;
    handleChange({ [name]: value });
  }

  return (
    <>
      <TextField
        id={name}
        name={name}
        label={label}
        variant={variant}
        multiline
        rows={4}
        fullWidth
        placeholder={placeholder}
        onChange={handleChangeField}
        value={value}
        required
        inputProps={{ maxLength: 300 }}
      />
    </>
  );
}
