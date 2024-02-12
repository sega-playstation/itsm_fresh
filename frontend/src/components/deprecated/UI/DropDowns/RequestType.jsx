import React, { useState } from 'react';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import requestTypeItems from '@/data/deprecated/requestTypeItems.json';

export default function RequestType({ value, handleInputChange }) {
  const [requestType, setRequestType] = useState(value);

  // Handles Selecting Value
  const handleChange = (event) => {
    const newValue = event.target.value;
    setRequestType(newValue);
    handleInputChange({ requestType: newValue });
  };

  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel id="request-label">Request Type</InputLabel>
      <Select
        label="Request Type"
        labelId="request-select-label-id"
        id="request-id"
        value={value}
        onChange={handleChange}
        required
      >
        <MenuItem value={requestType}>Select a Request Type</MenuItem>
        {requestTypeItems.map((option) => (
          <MenuItem key={option.key} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
