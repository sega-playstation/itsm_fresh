import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';

import FormCard from '@/components/deprecated/UI/FormCard';
import Loading from '@/components/deprecated/UI/Loading';

import ViewChangeRequestPage1 from './ViewChangeRequestPages/ViewChangeRequestPage1';
import ViewChangeRequestPage2 from './ViewChangeRequestPages/ViewChangeRequestPage2';

export default function ViewRequestForm({
  token,
  requestId,
  formData,
  loading,
}) {
  let navigate = useNavigate();
  const [page, setPage] = useState(1);

  if (loading) return <Loading />;

  const pages = () => {
    switch (page) {
      case 1:
        return (
          <ViewChangeRequestPage1
            formData={formData}
            children={ticketStepProgress()}
          />
        );
      case 2:
        return <ViewChangeRequestPage2 formData={formData} />;
      default:
        return null;
    }
  };

  const ticketStepProgress = () => {
    return (
      <Stepper
        nonLinear
        alternativeLabel
        activeStep={Number(formData.status) - 1}
      >
        <Step key={1}>
          <StepLabel>New</StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel>Pending</StepLabel>
        </Step>
        <Step key={3}>
          <StepLabel>Approved</StepLabel>
        </Step>
      </Stepper>
    );
  };

  const pageButton = () => {
    const buttons = [];
    if (page > 1) {
      buttons.push(
        <Button variant="contained" onClick={handleBack} sx={{ mr: 2 }}>
          Back
        </Button>
      );
    }
    if (page < 2) {
      buttons.push(
        <Button variant="contained" onClick={handleNext} sx={{ mr: 2 }}>
          Next
        </Button>
      );
    }

    buttons.push(
      <Button variant="contained" onClick={routeChangeBack} sx={{ mr: 2 }}>
        List
      </Button>
    );

    buttons.push(
      <Button variant="contained" onClick={routeChangeEdit} sx={{ mr: 2 }}>
        Edit
      </Button>
    );

    return buttons;
  };

  const routeChangeBack = () => {
    let path = '/change/all';
    navigate(path);
  };

  // Edit Button Logic
  const routeChangeEdit = () => {
    let path = '/change/edit?requestId=' + requestId;
    navigate(path);
  };

  // Next Button Logic
  const handleNext = () => {
    setPage(page + 1);
  };

  // Back Button Logic
  const handleBack = () => {
    setPage(page - 1);
  };

  return (
    <FormCard>
      <Box pt={4} pb={4}>
        {pages()}
      </Box>
      <Box pb={5} textAlign="center">
        {pageButton()}
      </Box>
    </FormCard>
  );
}
