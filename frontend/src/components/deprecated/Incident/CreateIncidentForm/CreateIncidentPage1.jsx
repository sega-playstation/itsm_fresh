import React, { useState, useEffect } from 'react';
import { Grid, Box, Divider, FormHelperText, FormControl } from '@mui/material';

import FormTitle from '@/components/deprecated/UI/FormTitle';
import TicketStepProgress from '@/components/deprecated/UI/TicketStepProgress';

import TicketNumber from '@/components/deprecated/UI/Fields/TicketNumber';
import SelectUser from '@/components/deprecated/UI/DropDowns/Users';
import TicketCreatedAt from '@/components/deprecated/UI/Fields/TicketCreatedAt';
import TicketOpenedBy from '@/components/deprecated/UI/Fields/TicketOpenedBy';

import TicketType from '@/components/deprecated/UI/DropDowns/TicketType';
import SecurityGroups from '@/components/deprecated/UI/DropDowns/SecurityGroups';
import DateTime from '@/components/deprecated/UI/Fields/DateTime';
import AssignedTechnicians from '@/components/deprecated/UI/DropDowns/AssignedTechnicians';
import IncidentSummaryAndDetailTabs from '@/components/deprecated/UI/Tabs/IncidentSummaryAndDetailTabs';

import TicketPriority from '@/components/deprecated/UI/Sliders/TicketPriority';
import MultipleAffected from '@/components/deprecated/UI/Sliders/MultipleAffected';

export default function CreateIncidentPage1({
  title,
  token,
  loginUser,
  formData,
  formType,
  handleInputChange,
  userIDError,
  assignedTechIdError,
  ticketTypeError,
  securityGroupError,
  subjectError,
  detailsError,
}) {
  const handleChange = (data) => {
    handleInputChange({
      ...formData,
      ...data,
    });
  };

  const [impact, setImpact] = useState(4);
  const [urgency, setUrgency] = useState(4);
  const [priority, setPriority] = useState({});

  const handleAffectedChange = (data) => {
    handleInputChange({
      ...formData,
      ...data,
    });
  };

  /**
   * Handle the Slider Data for Impact, Urgency, and Priority
   */
  const handleImpactChange = (event) => {
    const newImpact = event;
    setImpact(newImpact);
    handleInputChange({ impact: newImpact });
    calculatePriority(newImpact, urgency);
  };

  const handleUrgencyChange = (event) => {
    const newUrgency = event;
    setUrgency(newUrgency);
    handleInputChange({ urgency: newUrgency });
    calculatePriority(impact, newUrgency);
  };

  const calculatePriority = (impact, urgency) => {
    const newPriority = Math.floor((impact + urgency) / 2);
    setPriority(newPriority);
    handleInputChange({ priority: newPriority });
  };

  const hasErrorField = (fieldName) => {
    return (
      (fieldName === 'userId' && !!userIDError) ||
      (fieldName === 'assignedTechId' && !!assignedTechIdError) ||
      (fieldName === 'ticketType' && !!ticketTypeError) ||
      (fieldName === 'security_group' && !!securityGroupError) ||
      (fieldName === 'subject' && !!subjectError) ||
      (fieldName === 'details' && !!detailsError)
    );
  };

  // Shows TicketStepProgress component only if the formType = edit or view
  const ticketStepProgress = () => {
    if (formType === 'Edit' || formType === 'View') {
      return (
        <Grid item md={10} container justifyContent="center">
          <TicketStepProgress
            token={token}
            handleChange={handleChange}
            formType={formType}
            value={formData.status}
          />
        </Grid>
      );
    }
  };

  return (
    <>
      <Box pt={4} pb={4}>
        <FormTitle title={title} />
        <Grid item xs={12} container justifyContent="center">
          {ticketStepProgress()}

          <Grid item xs={4}>
            <Box pt={2}>
              <TicketNumber formData={formData} name="ticketNumber" />
            </Box>
            <Box pt={2} />
            <FormControl fullWidth error={hasErrorField('userId')}>
              <SelectUser
                token={token}
                label="User"
                name="userId"
                loginUser={loginUser}
                handleChange={handleChange}
                value={formData.userId}
              />
              {/* Display the error message for User ID */}
              {userIDError && (
                <FormHelperText error>{userIDError}</FormHelperText>
              )}
            </FormControl>
            <Box pt={2} />
            <TicketCreatedAt formData={{ ticketDateTime: new Date() }} />
            <Box pt={2} />
            <MultipleAffected
              handleAffectedChange={handleAffectedChange}
              formData={formData}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item md={4}>
            <Box pt={2}>
              <TicketPriority
                label="Impact"
                value={formData.impact}
                onChange={handleImpactChange}
              />
              <TicketPriority
                label="Urgency"
                value={formData.urgency}
                onChange={handleUrgencyChange}
              />
              <TicketPriority
                label="Priority"
                value={formData.priority}
                disabled
              />
            </Box>
          </Grid>

          <Grid item xs={10}>
            <br />
            <Divider />
            <br />
          </Grid>

          <Grid item md={4}>
            <TicketOpenedBy
              token={token}
              loginUser={loginUser}
              formType={formType}
              value={formData.ticketOwnerId}
              handleChange={handleChange}
            />
            <Box pt={2} />
            <FormControl fullWidth error={hasErrorField('ticketType')}>
              <TicketType
                token={token}
                handleChange={handleChange}
                value={formData.ticketType}
              />
              {/* Display the error message for User ID */}
              {ticketTypeError && (
                <FormHelperText error>{ticketTypeError}</FormHelperText>
              )}
            </FormControl>
            <Box pt={2} />
            <FormControl fullWidth error={hasErrorField('security_group')}>
              <SecurityGroups
                token={token}
                handleChange={handleChange}
                value={formData.security_group}
              />
              {/* Display the error message for Security Group*/}
              {securityGroupError && (
                <FormHelperText error>{securityGroupError}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={1} />
          <Grid item md={4}>
            <Box pt={2} />
            <FormControl fullWidth error={hasErrorField('reportDateTime')}>
              <DateTime
                label="Report Date Time"
                name="reportDateTime"
                inputFormat="MM/dd/yyyy HH:mm a"
                handleChange={handleChange}
                value={new Date(formData.reportDateTime)}
              />
            </FormControl>
            <Box pt={2} />
            <FormControl fullWidth error={hasErrorField('assignedTechId')}>
              <AssignedTechnicians
                token={token}
                name="assignedTechId"
                handleChange={handleChange}
                value={formData.assignedTechId}
              />
              {/* Display the error message for Assigned Tech ID */}
              {assignedTechIdError && (
                <FormHelperText error>{assignedTechIdError}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={10}>
            <br />
            <Divider />
            <br />
          </Grid>

          <Grid item xs={12}>
            <IncidentSummaryAndDetailTabs
              formData={formData}
              handleChange={handleChange}
            />
            {/* Display the error message for Assigned Tech ID */}
            {/* {subjectError && (
                  <FormHelperText error>{subjectError}</FormHelperText>
              )} */}
            {/* Display the error message for Assigned Tech ID */}
            {/* {detailsError && (
                  <FormHelperText error>{detailsErrorError}</FormHelperText>
              )} */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
