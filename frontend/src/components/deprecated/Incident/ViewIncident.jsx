import { useNavigate } from 'react-router-dom';

import {
  Grid,
  Box,
  TextField,
  Divider,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import TicketPriority from '@/components/deprecated/UI/Sliders/TicketPriority';

import TicketStepProgress from '@/components/deprecated/UI/TicketStepProgress';
import BaseAccordion from '@/components/deprecated/UI/DropDowns/BaseAccordion';

import IncidentSummaryAndDetailTabs from '@/components/deprecated/UI/Tabs/IncidentSummaryAndDetailTabs';

import FormCard from '@/components/deprecated/UI/FormCard';
import FormTitle from '@/components/deprecated/UI/FormTitle';
import Loading from '@/components/deprecated/UI/Loading';

/**
 * Default Export function for viewing incident ticket
 * Child components: IncidentComments
 */
export default function ViewIncident({ token, incidentId, formData, loading }) {
  const title = 'View Incident';
  const formType = 'view';

  let navigate = useNavigate();

  /**
   * Function to navigate the page back to the all list.
   */
  const routeChangeBack = () => {
    let path = '/incident/all';
    navigate(path);
  };

  /**
   * Function to navigate the page to edit the incident
   */
  const routeChangeEdit = () => {
    let path = '/incident/edit?incidentId=' + incidentId;
    navigate(path);
  };

  // Waits for data to be loaded
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <FormCard>
        <Box pt={4} pb={4}>
          <FormTitle title={title} />
          <Grid item xs={12} container spacing={2} justifyContent="center">
            <Grid item md={10} container justifyContent="center">
              <TicketStepProgress
                token={token}
                value={formData.status}
                formType={formType}
              />
            </Grid>
            <Grid item md={12} container justifyContent="center">
              <Grid item md={4}>
                <TicketPriority
                  label="Impact"
                  value={formData.impact}
                  disabled
                />
                <TicketPriority
                  label="Urgency"
                  value={formData.urgency}
                  disabled
                />
                <TicketPriority
                  label="Priority"
                  value={formData.priority}
                  disabled
                />
              </Grid>
            </Grid>
            <Grid item md={12} container justifyContent="center">
              <FormControlLabel
                control={<Switch color="primary" />}
                label="Multiple Affected User"
                labelPlacement="start"
                checked={formData.multipleAffectedUser}
                name="multipleUserAffected"
                sx={{ mr: 2 }}
                disabled
              />
              {formData.multipleAffectedUser && (
                <>
                  <TextField
                    label="No. of Users Affected"
                    variant="outlined"
                    value={formData.affected_amount}
                    disabled
                  />
                </>
              )}
            </Grid>
            <Grid item xs={9}>
              <BaseAccordion
                label={`SLA: ${formData.sla_info.sla_name}`}
                content={`Criteria: ${formData.sla_info.criteria}`}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                label="Ticket Number"
                variant="filled"
                fullWidth
                value={formData.ticketNumber.slice(0, 8)}
                readOnly
              />
            </Grid>
            <Grid item md={1} />
            <Grid item md={4}>
              <TextField
                label="Ticket Opened By"
                variant="filled"
                fullWidth
                value={formData.user_ticket_owner}
                readOnly
              />
            </Grid>

            <Grid item md={4}>
              <TextField
                label="User"
                variant="outlined"
                fullWidth
                value={formData.user_username}
                readOnly
              />
            </Grid>
            <Grid item md={1} />
            <Grid item md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Ticket Created At"
                  variant="outlined"
                  fullWidth
                  value={new Date(formData.ticketDateTime)}
                  slotProps={{ textField: { sx: { width: '100%' } } }}
                  onChange={() => {}}
                  readOnly
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={10}>
              <br />
              <Divider />
              <br />
            </Grid>

            <Grid item md={4}>
              <TextField
                label="Ticket Type"
                variant="outlined"
                fullWidth
                value={formData.ticketType_type}
                readOnly
              />
            </Grid>
            <Grid item md={1} />
            <Grid item md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Report Date Time"
                  variant="outlined"
                  fullWidth
                  value={new Date(formData.reportDateTime)}
                  slotProps={{ textField: { sx: { width: '100%' } } }}
                  onChange={() => {}}
                  readOnly
                />
              </LocalizationProvider>
            </Grid>
            <Grid item md={4}>
              <TextField
                label="Security Group"
                variant="outlined"
                fullWidth
                value={formData.security_group_name}
                readOnly
              />
            </Grid>
            <Grid item md={1} />
            <Grid item md={4}>
              <TextField
                label="Assigned Technician"
                variant="outlined"
                fullWidth
                value={formData.technician_name}
                readOnly
              />
            </Grid>

            <Grid item xs={10}>
              <br />
              <Divider />
              <br />
            </Grid>

            <Grid item xs={12}>
              <IncidentSummaryAndDetailTabs formData={formData} readOnly />
            </Grid>
          </Grid>
          <Box pt={1} textAlign="center">
            <Button
              type="button"
              variant="contained"
              onClick={routeChangeEdit}
              sx={{ mr: 2 }}
            >
              Edit
            </Button>
            <Button type="button" variant="contained" onClick={routeChangeBack}>
              Back
            </Button>
          </Box>
        </Box>
      </FormCard>
    </>
  );
}
