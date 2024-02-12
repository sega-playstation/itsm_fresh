import { Grid, Box } from '@mui/material';

import FormTitle from '@/components/deprecated/UI/FormTitle';

import BaseTextField2 from '@/components/deprecated/UI/Fields/BaseTextField2';

export default function InstallAndBackoutPlanPage({
  formData,
  handleInputChange,
  children,
}) {
  const title = 'Install & Backout Plan';
  return (
    <Grid>
      <Box>
        <FormTitle title={title} />
      </Box>
      <Box>{children}</Box>
      <Grid item container justifyContent="center" xs={12} p={2}>
        <Grid item xs={9}>
          <BaseTextField2
            placeholder="Write a Description (300 Characters Limit)"
            value={formData.install_plan_description}
            name="install_plan_description"
            label="Install Plan"
            variant="filled"
            handleChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={9}>
          <Box pt={2} />
          <BaseTextField2
            placeholder="Write a Description (300 Characters Limit)"
            value={formData.backout_plan_description}
            name="backout_plan_description"
            label="Backout Plan"
            variant="filled"
            handleChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
