import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Axios } from '@/utils/Axios';

import ReportForm from "../ReportForm";

export default function CreateReport() {
  return (
    <>
      <ReportForm label="Incident Report">
        <Box pt={5} textAlign="center">
          <Button
            component={Link}
            to="../report/new"
            variant="contained"
            style={{ margin: "10px" }}
          >
            Back
          </Button>
          <Button
            component={Link}
            to="./createincidentreport"
            variant="contained"
            style={{ margin: "10px" }}
          >
            Next
          </Button>
        </Box>
      </ReportForm>
    </>
  );
}
