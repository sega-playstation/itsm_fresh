import React, { useState, useEffect } from "react";
import { Slider, Typography } from "@mui/material";

export default function TicketPriority({ label, value, disabled, onChange }) {
  const [sliderValue, setSliderValue] = useState(value);

  const marks = [
    {
      value: 1,
      label: "1 - Critical",
    },
    {
      value: 2,
      label: "2 - High",
    },
    {
      value: 3,
      label: "3 - Medium",
    },
    {
      value: 4,
      label: "4 - Low",
    },
  ];

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleChange = (_, newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <>
      <Typography textAlign="center">{label}</Typography>
      <Slider
        size="small"
        aria-label="Restricted values"
        defaultValue={4}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
        min={1}
        max={4}
        value={sliderValue}
        disabled={disabled ? disabled : false}
        onChange={handleChange}
      />
    </>
  );
}
