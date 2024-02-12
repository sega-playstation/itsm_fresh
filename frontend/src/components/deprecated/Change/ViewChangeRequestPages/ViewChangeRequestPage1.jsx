import { Grid, Box, TextField, Divider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

import FormTitle from '@/components/deprecated/UI/FormTitle';

import BusinessJustififyAndPlanTabs from '@/components/deprecated/UI/Tabs/BusinessJustififyAndPlanTabs';
import BaseAccordion from '@/components/deprecated/UI/DropDowns/BaseAccordion';

export default function ViewChangeRequestPage1({ formData, children }) {
  return (
    <Grid>
      <Box textAlign="center">
        <FormTitle title="View Request" />
      </Box>
      <Box>{children}</Box>

      <Grid item xs={12} container justifyContent="center" pt={2} pb={2}>
        {/*  Request Details */}

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Request Number"
            value={formData.requestNumber.slice(0, 8)}
            variant="filled"
            disabled
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Request Type"
            value={formData.requestType}
            readOnly
          />
        </Grid>

        <Grid item xs={12} pt={2} />

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Project Name"
            value={formData.projectName}
            readOnly
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Request Name"
            value={formData.requestName}
            readOnly
          />
        </Grid>

        <Grid item xs={9}>
          <br />
          <Divider />
          <br />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Assigned Technician"
            value={formData.technician_name}
            readOnly
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Requested By"
            value={formData.user_username}
            readOnly
          />
        </Grid>

        <Grid item xs={12} pt={2} />

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Request Contact"
            value={formData.requestContact}
            readOnly
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Department"
            value={formData.department}
            readOnly
          />
        </Grid>

        <Grid item xs={12} pt={2} />

        <Grid item xs={9}>
          <TextField
            placeholder="Write a Description (300 Characters Limit)"
            multiline
            rows={3}
            fullWidth
            type="text"
            name="Description"
            label="Description"
            variant="filled"
            value={formData.description}
            readOnly
          />
        </Grid>

        <Grid item xs={9}>
          <br />
          <Divider />
          <br />
        </Grid>

        {/* Business Justification & Install/Backout Plan */}
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Start Date"
              value={new Date(formData.start_date)}
              slotProps={{ textField: { sx: { width: '100%' } } }}
              onChange={() => {}}
              readOnly
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="End Date"
              value={new Date(formData.end_date)}
              slotProps={{ textField: { sx: { width: '100%' } } }}
              onChange={() => {}}
              readOnly
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} pt={2} />

        <Grid item xs={9}>
          <BusinessJustififyAndPlanTabs formData={formData} />
        </Grid>

        <Grid item xs={9}>
          <br />
          <Divider />
          <br />
        </Grid>

        {/* Selected Asset */}

        <Grid item xs={9}>
          <BaseAccordion
            label={`Selected Assets`}
            content={
              <>
                {formData.asset_names.map((assets, index) => (
                  <div key={index}>
                    {index + 1}: {assets}
                  </div>
                ))}
              </>
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
