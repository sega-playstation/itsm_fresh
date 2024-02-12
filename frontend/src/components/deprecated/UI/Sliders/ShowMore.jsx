import React, { useState } from "react";
import { FormControlLabel, Switch } from "@mui/material";

export default function ShowMore({ label, children }) {
  const [isSliderChecked, setIsSliderChecked] = useState(false);

  const handleCheck = (e) => {
    setIsSliderChecked(e.target.checked);
  };

  return (
    <>
      <FormControlLabel
        control={<Switch color="primary" />}
        label={label}
        labelPlacement="start"
        onChange={handleCheck}
      />
      {isSliderChecked && <>{children}</>}
    </>
  );
}
