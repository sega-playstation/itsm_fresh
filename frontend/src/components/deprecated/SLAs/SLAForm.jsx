import React, { useState } from 'react';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material';

import FormCard from '@/components/deprecated/UI/FormCard';
import FormTitle from '@/components/deprecated/UI/FormTitle';
import PriorityDropDown from '@/components/deprecated/UI/DropDowns/PriorityDropDown';

import FormValidationBanner from '@/components/deprecated/UI/FormValidationBanner';

/**
 * Creates a new SLA based off of a ticket in any module and gives a timeline for the ticket to be resolved
 */

export default function SLAForm({
  formData,
  setFormData,
  formType,
  buttonLabel,
  onSubmit,
}) {
  const [error, setError] = useState('');
  const [priorityError, setPriorityError] = useState('');
  const [slaError, setSlaError] = useState('');
  const [criteriaError, setCriteriaError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    onSubmit();
  };

  /**
   * Sets the sla field as the textbox is changed
   */
  function handleSlaField(event) {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      sla_name: value,
    }));
    setSlaError('');
  }

  /**
   * Sets the criteria field as the textbox is changed
   */
  function handleCriteriaField(event) {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      criteria: value,
    }));
    setCriteriaError('');
  }

  // Handles Form Data
  const handleInputChange = (data) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...data,
    }));
  };

  /**
   * Validates the form for all input fields.
   */
  const validateInfo = () => {
    hideAllErrors();

    if (!isValidate()) {
      setError(
        'An error Has occurred! Please check for any errors on the form and try again.'
      );
      return false;
    } else {
      return true;
    }
  };

  /**
   * Hides all of the error messages to reevaluate if there are errors
   */
  function hideAllErrors() {
    setError('');
    setPriorityError('');
    setSlaError('');
    setCriteriaError('');
  }

  /**
   * Validates all input fields.
   */
  function isValidate() {
    let isSLACorrect = true;

    if (isEmpty(formData.priority)) {
      isSLACorrect = false;
      setPriorityError('A row must be selected!');
    }

    // Check if Sla is empty
    if (isEmpty(formData.sla_name)) {
      isSLACorrect = false;
      setSlaError('SLA Name is required!');
    }

    // Check if Criteria is empty
    if (isEmpty(formData.criteria)) {
      isSLACorrect = false;
      setCriteriaError('Criteria is required!');
    }

    return isSLACorrect;
  }

  /**
   * Checks if input field is empty, undefined or null.
   *
   * @param {Input Field value} data
   * @returns True if empty, false if not.
   */

  const isEmpty = (data) => {
    return data === null || data === '' || data === undefined || data === 0;
  };

  document.title = 'New SLA - PiXELL-River';

  return (
    <>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <Box pt={4} pb={4}>
            <Box textAlign="center">
              <FormTitle title={`${formType} Service Level Agreement`} />
            </Box>
            <Grid
              item
              xs={12}
              spacing={2}
              container
              justifyContent="center"
              p={2}
            >
              <Grid item xs={5}>
                <TextField
                  error={slaError !== ''}
                  required
                  fullWidth
                  type="text"
                  name="sla_name"
                  label="SLA Name"
                  variant="outlined"
                  id="sla_name"
                  inputProps={{ maxLength: 50 }}
                  value={formData.sla_name}
                  onChange={handleSlaField}
                />
                <FormHelperText error={slaError !== ''}>
                  {slaError}
                </FormHelperText>
              </Grid>
              <Grid item xs={5}>
                <PriorityDropDown
                  value={formData.priority}
                  handleInputChange={handleInputChange}
                  priorityError={priorityError}
                >
                  <FormHelperText error={priorityError !== ''}>
                    {priorityError}
                  </FormHelperText>
                </PriorityDropDown>
              </Grid>

              <Grid item xs={10} />

              <Grid item xs={10}>
                <TextField
                  error={criteriaError !== ''}
                  required
                  placeholder="Write a Descriptive SLA Criteria (250 Word Limit)"
                  multiline
                  rows={3}
                  fullWidth
                  type="text"
                  name="criteria"
                  label="Criteria"
                  variant="filled"
                  id="criteria"
                  inputProps={{ maxLength: 250 }}
                  value={formData.criteria}
                  onChange={handleCriteriaField}
                />
                <FormHelperText error={criteriaError !== ''}>
                  {criteriaError}
                </FormHelperText>
              </Grid>
              <Grid
                item
                xs={10}
                container
                spacing={2}
                justifyContent="center"
                textAlign="center"
              >
                <Box pt={4} sx={{ width: '100%' }}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={validateInfo}
                  >
                    {buttonLabel}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* Error banner display */}
          {error ? <FormValidationBanner error={error} /> : null}
        </form>
      </FormCard>
    </>
  );
}
