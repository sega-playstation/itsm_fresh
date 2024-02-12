import { Grid, Box } from '@mui/material';

import FormTitle from '@/components/deprecated/UI/FormTitle';
import RequestType from '@/components/deprecated/UI/DropDowns/RequestType';

export default function RequestTypePage({
  handleInputChange,
  formData,
  title,
  children,
}) {
  return (
    <Grid>
      <Box>
        <FormTitle title={title} />
      </Box>
      <Box>{children}</Box>
      <Grid item container justifyContent="center" xs={12} p={2}>
        <Grid item xs={5}>
          <RequestType
            value={formData.requestType}
            handleInputChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
