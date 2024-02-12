import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

export default function DateTime({
  label,
  handleChange,
  value,
  name,
  inputFormat,
}) {
  const [date, setDate] = useState(value);
  const currentDate = new Date();

  const handleDateChange = (newValue) => {
    if (newValue > currentDate || name === "reportDateTime") {
      setDate(newValue);
      handleChange({ [name]: newValue });
    } else {
      console.log(
        `Error: Date must be greater than ${currentDate.toLocaleDateString()}`
      );
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label={label}
          value={date}
          inputFormat={inputFormat}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField required {...params} sx={{ width: "100%" }} />
          )}
        />
      </LocalizationProvider>
    </>
  );
}
