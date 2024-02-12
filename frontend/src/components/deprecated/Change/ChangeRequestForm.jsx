import React, { useState, useEffect } from 'react';
import '@/styles/deprecated/preloader3.css';

import {
  Box,
  Button,
  Stepper,
  Step,
  StepButton,
  StepLabel,
} from '@mui/material';

import FormCard from '@/components/deprecated/UI/FormCard';
import RequestTypePage from './ChangeRequestPages/RequestTypePage';
import AssetsPage from './ChangeRequestPages/AssetsPage';
import RequestDetailsPage from './ChangeRequestPages/RequestDetailsPage';
import RiskAssessmentPage from './ChangeRequestPages/RiskAssessmentPage';
import BusinessJustifcationPage from './ChangeRequestPages/BusinessJustifcationPage';
import InstallAndBackoutPlanPage from './ChangeRequestPages/InstallAndBackoutPlanPage';

import FormValidationBanner from '@/components/deprecated/UI/FormValidationBanner';

export default function ChangeRequestForm({
  token,
  title,
  formType,
  ticketOwnerRole,
  formData,
  setFormData,
  buttonLabel,
  onSubmit,
}) {
  const [page, setPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState(formData.status - 1);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const pages = () => {
    switch (page) {
      case 1:
        return (
          <RequestTypePage
            token={token}
            title={title}
            formData={formData}
            handleInputChange={handleInputChange}
            children={ticketStepProgress()}
          />
        );
      case 2:
        return (
          <AssetsPage
            token={token}
            formData={formData}
            handleInputChange={handleInputChange}
            children={ticketStepProgress()}
          />
        );
      case 3:
        return (
          <RequestDetailsPage
            token={token}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            ticketOwnerRole={ticketOwnerRole}
            children={ticketStepProgress()}
          />
        );
      case 4:
        return (
          <RiskAssessmentPage
            token={token}
            formData={formData}
            handleInputChange={handleInputChange}
            children={ticketStepProgress()}
          />
        );
      case 5:
        return (
          <BusinessJustifcationPage
            token={token}
            formData={formData}
            handleInputChange={handleInputChange}
            children={ticketStepProgress()}
          />
        );
      case 6:
        return (
          <InstallAndBackoutPlanPage
            token={token}
            formData={formData}
            handleInputChange={handleInputChange}
            children={ticketStepProgress()}
          />
        );
      default:
        return null;
    }
  };

  function validateFormBeforeSubmit() {
    // Check all the fields in the formData state
    return (
      validateForm(1) &&
      validateForm(2) &&
      validateForm(3) &&
      validateForm(4) &&
      validateForm(5)
    );
  }

  function validateForm() {
    switch (page) {
      case 1:
        return formData.requestType;
      case 2:
        return formData.assets;
      case 3:
        return (
          formData.projectName &&
          formData.requestName &&
          formData.assignedTechId &&
          formData.requestedById &&
          formData.requestContact &&
          formData.department &&
          formData.description
        );
      case 4:
        return (
          formData.doc_config &&
          formData.environment &&
          formData.redundancy &&
          formData.environment_maturity &&
          formData.time_to_implement &&
          formData.change_history &&
          formData.deployment_window &&
          formData.num_of_staff &&
          formData.testing &&
          formData.backout_plan_risk &&
          formData.scheduling
        );
      case 5:
        if (formType === 'Edit') {
          return (
            formData.end_date >= formData.start_date &&
            formData.install_plan_description &&
            formData.backout_plan_description
          );
        } else {
          return (
            formData.end_date >= formData.start_date &&
            formData.purpose &&
            formData.need &&
            formData.duration
          );
        }
      case 6:
        return (
          formData.install_plan_description && formData.backout_plan_description
        );
      default:
        return true;
    }
  }

  const handleStatusStep = (step) => () => {
    setActiveStatus(step);
    handleInputChange({ status: step + 1 });
  };

  useEffect(() => {
    handleStatusStep();
  }, [activeStatus]);

  const ticketStepProgress = () => {
    if (formType === 'Edit') {
      return (
        <Stepper nonLinear alternativeLabel activeStep={activeStatus}>
          <Step key={1}>
            <StepButton color="inherit" onClick={handleStatusStep(0)}>
              <StepLabel>New</StepLabel>
            </StepButton>
          </Step>
          <Step key={2}>
            <StepButton color="inherit" onClick={handleStatusStep(1)}>
              <StepLabel>Pending</StepLabel>
            </StepButton>
          </Step>
          <Step key={3}>
            <StepButton color="inherit" onClick={handleStatusStep(2)}>
              <StepLabel>Approved</StepLabel>
            </StepButton>
          </Step>
        </Stepper>
      );
    }
  };

  const pageButton = () => {
    const buttons = [];
    if (page > 1) {
      buttons.push(
        <Button
          key="back"
          variant="contained"
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
      );
    }
    if (page < 6) {
      buttons.push(
        <Button
          key="next"
          variant="contained"
          onClick={handleNext}
          sx={{ mr: 2 }}
        >
          Next
        </Button>
      );
    }
    if (page === 6) {
      buttons.push(
        <Button
          key="submit"
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={!validateFormBeforeSubmit()}
        >
          {buttonLabel}
        </Button>
      );
    }
    return buttons;
  };

  // Next Button Logic
  const handleNext = () => {
    if (validateForm()) {
      setPage(page + 1);
      setError('');
    } else {
      setError('Please fill out all fields before proceeding.');
    }
  };

  // Back Button Logic
  const handleBack = () => {
    setPage(page - 1);
  };

  // Handles Form Data
  const handleInputChange = (data) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...data,
    }));
  };

  return (
    <FormCard>
      <form onSubmit={handleSubmit}>
        <Box pt={4} pb={4}>
          {pages()}
        </Box>
        <Box pb={5} textAlign="center">
          {pageButton()}
        </Box>
        <Box>{error ? <FormValidationBanner error={error} /> : null}</Box>
      </form>
    </FormCard>
  );
}
