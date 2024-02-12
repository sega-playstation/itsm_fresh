import React, { useState, useEffect } from "react";
import { Axios } from '@/utils/Axios';

import { Box, Stepper, Step, StepLabel } from "@mui/material";

export default function TicketStepProgress({
  token,
  handleChange,
  formType,
  value,
}) {
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(value - 1);

  const getStatus = async () => {
    try {
      const response = await Axios({
        method: "GET",
        url: `/api/problemStatus/`,

      });
      setSteps(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  const handleStep = (index) => {
    if (formType === "edit") {
      const step = steps[index];
      setActiveStep(index); // Set the activeStep to the selected index directly
      handleChange({ status: step.status_id });
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <Box pt={3} sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} nonLinear alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.id} onClick={() => handleStep(index)}>
            <StepLabel>{step.status_name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
