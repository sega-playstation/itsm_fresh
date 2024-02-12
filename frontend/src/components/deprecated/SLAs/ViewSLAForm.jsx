import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Button, Typography, Grid, TextField } from '@mui/material';
import FormCard from '@/components/deprecated/UI/FormCard';
import FormTitle from '@/components/deprecated/UI/FormTitle';
import Loading from '@/components/deprecated/UI/Loading';

import BaseAccordion from '@/components/deprecated/UI/DropDowns/BaseAccordion';

/**
 * Creates a new SLA based off of a ticket in any module and gives a timeline for the ticket to be resolved
 */
export default function ViewSLAForm({ token, formData, slaId, loading }) {
  let navigate = useNavigate();

  // Waits for data to be loaded
  if (loading) {
    return <Loading />;
  }

  // Makes Section Component Visible if NOT admin
  const showSectionComponent = () => {
    if (formData.role_name !== 'Admin') {
      return (
        <Grid item xs={10}>
          <TextField
            disabled
            fullWidth
            type="text"
            name="section"
            label="Section"
            variant="outlined"
            id="sectionId"
            value={formData.section_name}
          />
        </Grid>
      );
    }
  };

  /**
   * Function to navigate the page back to the all list.
   */
  const routeChangeBack = () => {
    let path = '/sla/all';
    navigate(path);
  };

  const routeChangeEdit = () => {
    let path = '/sla/edit?slaId=' + slaId;
    navigate(path);
  };

  document.title = 'New SLA - PiXELL-River';

  return (
    <FormCard>
      <Box pt={4} pb={4}>
        <Box textAlign="center">
          <FormTitle title="View Service Level Agreement" />
          <Typography
            variant="h6"
            color="#525252"
            align="center"
            sx={{ textTransform: 'uppercase' }}
          >
            {`CREATED BY ${formData.role_name}`}
          </Typography>
        </Box>
        <Grid item xs={12} spacing={2} container justifyContent="center" p={2}>
          <Grid item xs={5}>
            <TextField
              disabled
              fullWidth
              type="text"
              name="sla_name"
              label="SLA Name"
              variant="filled"
              id="slaId"
              value={formData.sla_name}
            />
          </Grid>
          <Grid item xs={5}>
            <BaseAccordion
              label={`Priority: ${formData.priority_info.name}`}
              content={
                <>
                  <div>{`Response Time: ${formData.priority_info.response_time} hours(s)`}</div>
                  <div>{`Resolution Time: ${formData.priority_info.resolution_time} hours(s)`}</div>
                  <div>{`Availability: ${formData.priority_info.availability}`}</div>
                </>
              }
            ></BaseAccordion>
          </Grid>
          {showSectionComponent()}
          <Grid item xs={5}>
            <TextField
              disabled
              fullWidth
              type="text"
              name="response_time"
              label="Response Time"
              variant="outlined"
              id="responseTimeId"
              value={`${formData.response_time} Hours(s)`}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              disabled
              fullWidth
              type="text"
              name="resolution_time"
              label="Resolution Time"
              variant="outlined"
              id="resolutionTimeId"
              value={`Within ${formData.resolution_time} Hours(s)`}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              disabled
              fullWidth
              type="text"
              name="availability"
              label="Availability"
              variant="outlined"
              id="availabilityId"
              value={formData.availability}
            />
          </Grid>

          <Grid item xs={10} />

          <Grid item xs={10}>
            <TextField
              disabled
              multiline
              rows={3}
              fullWidth
              type="text"
              name="criteria"
              label="Criteria"
              variant="filled"
              id="criteria"
              value={formData.criteria}
            />
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
                type="button"
                variant="contained"
                onClick={routeChangeBack}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ mr: 2 }}
                onClick={routeChangeEdit}
              >
                Edit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </FormCard>
  );
}
