import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import{  Axios } from '@/utils/Axios';

export default function ReportForm({ label, children }) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Paper elevation={10}>
            <Box p={4}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="#525252"
                align="center"
                pb={5}
              >
                {label}
              </Typography>
            </Box>
            <Box pb={4}>{children}</Box>
          </Paper>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </>
  );
}
