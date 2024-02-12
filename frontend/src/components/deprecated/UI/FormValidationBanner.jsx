import React from "react";
import { Alert, AlertTitle } from "@mui/material";

/**
 * Form Validation Banner for create pages
 **/
export default function FormValidationBanner({ error }) {
  return (
    <Alert
      severity="error"
      sx={{ justifyContent: "center", py: "2vh", width: "100%" }}
    >
      <AlertTitle>Error</AlertTitle>
      <strong>{error}</strong>
    </Alert>
  );
}
