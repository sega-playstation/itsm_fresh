import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl } from '@mui/material';
import FormValidationBanner from '@/components/deprecated/UI/FormValidationBanner';
import FormCard from '@/components/deprecated/UI/FormCard';
import CreateIncidentPage1 from './CreateIncidentForm/CreateIncidentPage1';
import CreateIncidentPage2 from './CreateIncidentForm/CreateIncidentPage2';
import Loading from '@/components/deprecated/UI/Loading';

// Comments needs to be fixed
// import IncidentComments from "./IncidentComments";

export default function IncidentForm({
  title,
  formType,
  buttonLabel,
  formData,
  setFormData,
  onSubmit,
}) {
  const token = sessionStorage.getItem('access');

  const loginUser = sessionStorage.getItem('username');

  const [userIDError, setUserIDError] = useState('');
  const [assignedTechIdError, setAssignedTechIdError] = useState('');
  const [ticketTypeError, setTicketTypeError] = useState('');
  const [securityGroupError, setSecurityGroupError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [detailsError, setDetailsError] = useState('');

  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const handleInputChange = (data) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...data,
    }));

    // Reset the errors when the input changes
    setSubjectError('');
    setDetailsError('');
  };

  // Displaying Current Page
  const PageDisplay = () => {
    switch (page) {
      case 1:
        return (
          <CreateIncidentPage1
            title={title}
            token={token}
            loginUser={loginUser}
            handleInputChange={handleInputChange}
            formType={formType}
            formData={formData}
            userIDError={userIDError}
            ticketTypeError={ticketTypeError}
            assignedTechIdError={assignedTechIdError}
            securityGroupError={securityGroupError}
            subjectError={subjectError}
            detailsError={detailsError}
            setSubjectError={setSubjectError}
            setDetailsError={setDetailsError}
            setError={setError} // Corrected prop name
          />
        );
      case 2:
        return (
          <CreateIncidentPage2
            title={title}
            label="Select an SLA"
            handleInputChange={handleInputChange}
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  function validateFormBeforeSubmit() {
    // Check all the fields in the formData state
    return validateForm(1) && true && true;
  }

  function validateForm() {
    let isFormValid = true;

    switch (page) {
      case 1:
        // Validation for the first page
        if (!formData.userId) {
          isFormValid = false;
          setUserIDError('User ID is required!');
        } else {
          setUserIDError('');
        }

        if (!formData.assignedTechId) {
          isFormValid = false;
          setAssignedTechIdError('Assigned Tech is required!');
        } else {
          setAssignedTechIdError('');
        }

        if (!formData.ticketType) {
          isFormValid = false;
          setTicketTypeError('Ticket Type is required!');
        } else {
          setTicketTypeError('');
        }

        if (!formData.security_group) {
          isFormValid = false;
          setSecurityGroupError('Security group is required!');
        } else {
          setSecurityGroupError('');
        }

        if (!formData.subject) {
          isFormValid = false;
          setSubjectError('Subject is required!');
        } else {
          setSubjectError('');
        }

        if (!formData.details) {
          isFormValid = false;
          setDetailsError('Details is required!');
        } else {
          setDetailsError('');
        }
        // Other field validations for the first page
        break;
      case 2:
        return formData.slaId;
      default:
        return null;
    }

    return isFormValid;
  }

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
    if (page < 2) {
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
    if (page === 2) {
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

  // For Testing Form Data Inputs
  useEffect(() => {
    // console.log("TEST:", formData);
    setLoading(false);
  }, [formData]);

  // Waits for data to be loaded
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <Box>{PageDisplay()}</Box>
          <Box pb={5} textAlign="center">
            {pageButton()}
          </Box>
          <Box>{error ? <FormValidationBanner error={error} /> : null}</Box>
        </form>
        {/* Comments needs to be fixed */}
        {/* {formType === "Edit" ? (
          <Box>
            <IncidentComments />
          </Box>
        ) : null} */}
      </FormCard>
    </>
  );
}
