import { Grid, Box } from '@mui/material';

import FormTitle from '@/components/deprecated/UI/FormTitle';
import DateTime from '@/components/deprecated/UI/Fields/DateTime';

import BaseTextField2 from '@/components/deprecated/UI/Fields/BaseTextField2';

export default function BusinessJustifcationPage({
  formData,
  handleInputChange,
  children,
}) {
  const title = 'Business Justification';

  return (
    <Grid>
      <Box>
        <FormTitle title={title} />
      </Box>
      <Box>{children}</Box>
      <Grid item container justifyContent="center" xs={12} p={2}>
        <Grid item xs={4}>
          <DateTime
            label="Start Date"
            name="start_date"
            value={new Date(formData.start_date)}
            inputFormat="MM/dd/yyyy"
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <DateTime
            label="End Date"
            name="end_date"
            value={new Date(formData.end_date)}
            inputFormat="MM/dd/yyyy"
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Box pt={2} />
          <BaseTextField2
            placeholder="Write a Description (300 Characters Limit)"
            value={formData.purpose}
            name="purpose"
            label="What is it for?"
            variant="filled"
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={4}>
          <Box pt={2} />
          <BaseTextField2
            placeholder="Write a Description (300 Characters Limit)"
            value={formData.need}
            name="need"
            label="Why The change is needed?"
            variant="filled"
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Box pt={2} />
          <BaseTextField2
            placeholder="Write a Description (300 Characters Limit)"
            value={formData.duration}
            name="duration"
            label="How long will it be in effect?"
            variant="filled"
            handleChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
