import { Box, Button } from '@mui/material';
import ReportForm from '@/components/deprecated/Report/ReportForm';

import { Link } from 'react-router-dom';

export default function CreateReportPage() {
  return (
    <>
      <ReportForm label="New Report">
        <Box pt={5} textAlign="center">
          <Button
            component={Link}
            to="./createincidentreport"
            variant="contained"
            style={{ margin: '10px' }}
          >
            Next
          </Button>
        </Box>
      </ReportForm>
    </>
  );
}
