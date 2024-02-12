import AssetDataGrid from '@/components/deprecated/UI/DataGrids/AssetDataGrid';
import { Grid, Box } from '@mui/material';

import FormTitle from '@/components/deprecated/UI/FormTitle';

export default function AssetsPage({
  token,
  formData,
  handleInputChange,
  children,
}) {
  const title = 'Select an Asset';
  return (
    <Grid>
      <Box>
        <FormTitle title={title} />
      </Box>
      <Box>{children}</Box>
      <Grid item container justifyContent="center" xs={12} p={2}>
        <Grid item xs={11}>
          <Box sx={{ height: '65vh', width: '100%' }}>
            <AssetDataGrid
              token={token}
              name="assets"
              handleInputChange={handleInputChange}
              value={formData.assets}
              url="?isActive=true"
              checkboxSelection
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
