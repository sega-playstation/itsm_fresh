import React from 'react';

import {
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

import FormTitle from '@/components/deprecated/UI/FormTitle';
import TicketPriority from '@/components/deprecated/UI/Sliders/TicketPriority';
import changeRequestItems from '@/data/deprecated/changeRequestItems.json';

export default function ViewChangeRequestPage2({ formData }) {
  const title = 'Risk Assessment';
  const keys = Object.keys(changeRequestItems[0]);

  const fieldMapping = {
    'Documentation of Configuration': 'doc_config',
    Environment: 'enviroment',
    Redundancy: 'redundancy',
    'Environment Maturity': 'enviroment_maturity',
    'Time ot Implement': 'time_to_implement',
    'Change History': 'change_history',
    'Deployment Window': 'deployment_window',
    'Number of Staff/Teams Required': 'num_of_staff',
    'Pre-Production Testing': 'testing',
    'Backout Plan': 'backout_plan_risk',
    'Change Scheduling': 'scheduling',
  };

  // Risk Assessment Calculation

  // Generate the FormControl and Select components using the keys
  const formControls = keys.map((key, index) => {
    const options = changeRequestItems[0][key];
    const isChangeRequestItems2AndBeyond = index >= 2;
    return (
      <React.Fragment key={index}>
        {isChangeRequestItems2AndBeyond && <Box pt={2} />}
        <FormControl key={index} fullWidth>
          <InputLabel id={`label-${index}`}>{key}</InputLabel>
          <Select
            name={`select-${index}`}
            label={`label-${index}`}
            id={`select-${index}`}
            labelId={`label-${index}`}
            value={formData[fieldMapping[key]]}
            defaultValue=""
            readOnly
          >
            {options.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </React.Fragment>
    );
  });

  // Split formControls into two columns
  const firstColumnControls = formControls.filter(
    (_, index) => index % 2 === 0
  );
  const secondColumnControls = formControls.filter(
    (_, index) => index % 2 !== 0
  );

  return (
    <Grid>
      <Box>
        <FormTitle title={title} />
      </Box>
      <Grid item container justifyContent="center" xs={12} p={2}>
        <Grid item xs={4}>
          {firstColumnControls}
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          {secondColumnControls}
        </Grid>
        <Grid item xs={4}>
          <TicketPriority label="Impact" value={formData.impact} disabled />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <TicketPriority label="Urgency" value={formData.urgency} disabled />
        </Grid>
        <Grid item xs={9}>
          <TicketPriority
            label="Risk Level"
            disabled
            value={formData.priority}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
