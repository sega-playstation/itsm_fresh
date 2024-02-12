import { Grid, Box, TextField, Divider } from '@mui/material';

import FormTitle from '@/components/deprecated/UI/FormTitle';
import AssignedTechnicians from '@/components/deprecated/UI/DropDowns/AssignedTechnicians';
import Users from '@/components/deprecated/UI/DropDowns/Users';

import TicketNumber from '@/components/deprecated/UI/Fields/TicketNumber';
import BaseTextField from '@/components/deprecated/UI/Fields/BaseTextField';

export default function RequestDetailsPage({
  token,
  ticketOwnerRole,
  formData,
  setFormData,
  handleInputChange,
  children,
}) {
  const title = 'Request Details';

  const handleDescription = (event) => {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: value,
    }));
  };

  return (
    <Grid>
      <Box>
        <FormTitle title={title} />
      </Box>
      <Box>{children}</Box>
      <Grid item container justifyContent="center" xs={12} p={2}>
        <Grid item xs={4}>
          <TicketNumber formData={formData} name="requestNumber" />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4} />

        <Grid item xs={4}>
          <Box pt={2} />
          <BaseTextField
            label="Project Name"
            name="projectName"
            value={formData.projectName}
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <Box pt={2} />
          <BaseTextField
            label="Request Name"
            name="requestName"
            value={formData.requestName}
            handleChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={10}>
          <br />
          <Divider />
          <br />
        </Grid>

        <Grid item xs={4}>
          <AssignedTechnicians
            token={token}
            name="assignedTechId"
            value={formData.assignedTechId}
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <Users
            token={token}
            name="requestedById"
            label="Requested By"
            value={formData.requestedById}
            ticketOwnerRole={ticketOwnerRole}
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Box pt={2} />
          <BaseTextField
            label="Request Contact"
            name="requestContact"
            value={formData.requestContact}
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <Box pt={2} />
          <BaseTextField
            label="Department"
            name="department"
            value={formData.department}
            handleChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={10}>
          <br />
          <Divider />
          <br />
        </Grid>

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
            id="description"
            value={formData.description}
            onChange={handleDescription}
            inputProps={{ maxLength: 300 }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
