import React, { useState, useEffect } from 'react';

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

export default function RiskAssessmentPage({
  formData,
  handleInputChange,
  children,
}) {
  const title = 'Risk Assessment';

  const [impact, setImpact] = useState(0);
  const [urgency, setUrgency] = useState(0);

  const fieldMapping = {
    'Documentation of Configuration': 'doc_config',
    Environment: 'environment',
    Redundancy: 'redundancy',
    'Environment Maturity': 'environment_maturity',
    'Time ot Implement': 'time_to_implement',
    'Change History': 'change_history',
    'Deployment Window': 'deployment_window',
    'Number of Staff/Teams Required': 'num_of_staff',
    'Pre-Production Testing': 'testing',
    'Backout Plan': 'backout_plan_risk',
    'Change Scheduling': 'scheduling',
  };

  const [impactWeights, setImpactWeights] = useState({
    doc_config: '',
    redundancy: '',
    time_to_implement: '',
    deployment_window: '',
    testing: '',
    scheduling: '',
  });

  const [urgencyWeights, setUrgencyWeights] = useState({
    environment: '',
    environment_maturity: '',
    change_history: '',
    num_of_staff: '',
    backout_plan_risk: '',
  });

  const keys = Object.keys(changeRequestItems[0]);

  // Generate the FormControl and Select components using the keys
  const formControls = keys.map((key, index) => {
    const options = changeRequestItems[0][key];
    const isChangeRequestItems2AndBeyond = index >= 2; // This is for space between dropdowns (UI Purpose)
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
            onChange={(event) => handleChange(event, index)}
            defaultValue=""
          >
            {options.map((option) => (
              <MenuItem
                key={option.key}
                value={option.value}
                data-weight={option.weight}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </React.Fragment>
    );
  });

  const handleChange = (event, index) => {
    const selectedValue = event.target.value;
    const fieldName = fieldMapping[Object.keys(changeRequestItems[0])[index]];

    // Find the selected option object based on the selectedValue
    const selectedOption = changeRequestItems[0][
      Object.keys(changeRequestItems[0])[index]
    ].find((option) => option.value === selectedValue);

    // If the selected option is found, use its weight as the new value
    const newValue = selectedOption ? selectedOption.value : null;
    const weightValue = selectedOption ? selectedOption.weight : null;

    // Now you can use newValue as desired (e.g., store it in the state)
    // Store the selected value and weight temporarily
    const selectedData = { [fieldName]: newValue };
    const weightData = { [fieldName]: weightValue };

    // Update the state for formData and impactWeights
    handleInputChange(selectedData);
    if (impactWeights.hasOwnProperty(fieldName)) {
      handleImpactWeight(weightData);
    }

    if (urgencyWeights.hasOwnProperty(fieldName)) {
      handleUrgencyWeight(weightData);
    }
  };

  const calculateAverage = (weights) => {
    const weightSum = Object.values(weights)
      .filter((weight) => weight !== null)
      .map((weight) => parseInt(weight))
      .filter((weight) => !isNaN(weight))
      .reduce((sum, weight) => sum + weight, 0);

    const weightCount = Object.values(weights).filter(
      (weight) => weight !== null
    ).length;

    return weightCount > 0 ? Math.round(weightSum / weightCount) : 0;
  };

  // Function to handle impact weights
  const handleImpactWeight = (data) => {
    setImpactWeights((prevFormData) => ({
      ...prevFormData,
      ...data,
    }));

    // Calculate the average of impact weights
    const impactWeightsAverage = calculateAverage({
      ...impactWeights,
      ...data,
    });

    // Update the state with the average
    setImpact(impactWeightsAverage);
  };

  // Function to handle urgency weights
  const handleUrgencyWeight = (data) => {
    setUrgencyWeights((prevFormData) => ({
      ...prevFormData,
      ...data,
    }));

    // Calculate the average of urgency weights
    const urgencyWeightsAverage = calculateAverage({
      ...urgencyWeights,
      ...data,
    });

    // Update the state with the average
    setUrgency(urgencyWeightsAverage);
  };

  useEffect(() => {
    const initialImpactWeights = {};
    const initialUrgencyWeights = {};

    // Extract the corresponding weights from the formData and populate the states
    keys.forEach((key) => {
      const fieldName = fieldMapping[key];
      const selectedValue = formData[fieldName];
      const selectedOption = changeRequestItems[0][key].find(
        (option) => option.value === selectedValue
      );

      if (selectedOption) {
        if (impactWeights.hasOwnProperty(fieldName)) {
          initialImpactWeights[fieldName] = selectedOption.weight;
        }

        if (urgencyWeights.hasOwnProperty(fieldName)) {
          initialUrgencyWeights[fieldName] = selectedOption.weight;
        }
      }
    });

    // Update the state with the initial weights
    setImpactWeights((prevImpactWeights) => ({
      ...prevImpactWeights,
      ...initialImpactWeights,
    }));

    setUrgencyWeights((prevUrgencyWeights) => ({
      ...prevUrgencyWeights,
      ...initialUrgencyWeights,
    }));

    // Calculate the average of impact weights
    const impactWeightsAverage = calculateAverage(initialImpactWeights);

    // Calculate the average of urgency weights
    const urgencyWeightsAverage = calculateAverage(initialUrgencyWeights);

    // Update the state with the averages
    setImpact(impactWeightsAverage);
    setUrgency(urgencyWeightsAverage);
  }, [formData]);

  useEffect(() => {
    const calculatePriority = Math.floor((impact + urgency) / 2);

    handleInputChange({ impact: impact });
    handleInputChange({ urgency: urgency });
    handleInputChange({ priority: calculatePriority });
  }, [impact, urgency]);

  // Split forControls into two columns
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
      <Box>{children}</Box>
      <Grid item container justifyContent="center" xs={12} p={2}>
        <Grid item xs={4}>
          {firstColumnControls}
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          {secondColumnControls}
        </Grid>
        <Grid item xs={4}>
          <TicketPriority label="Impact" value={formData.impact} readOnly />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <TicketPriority label="Urgency" value={formData.urgency} readOnly />
        </Grid>
        <Grid item xs={9}>
          <TicketPriority
            label="Risk Level"
            value={formData.priority}
            readOnly
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
