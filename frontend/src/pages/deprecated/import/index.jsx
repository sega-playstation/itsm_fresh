import React from 'react';
import { Box } from '@mui/material';
import Import from '@/components/deprecated/Import/Import';
import CsvImporter from '@/components/deprecated/Import/CsvImporter';
import { Link } from 'react-router-dom';
import MuiLink from '@mui/material/Link';

export default function ImportPage() {
  return (
    <>
      <Import />
      <CsvImporter />
      <Box mt={2}>
        <MuiLink component={Link} to="/instructions">
          View Instructions
        </MuiLink>
      </Box>
    </>
  );
}
