import React from 'react';
import { Box, Typography } from '@mui/material';

import SLADataGrid from '@/components/deprecated/UI/DataGrids/SLADataGrid';
import FormTitle from '@/components/deprecated/UI/FormTitle';

export default function CreateIncidentPage2({
  title,
  label,
  formData,
  handleInputChange,
}) {
  const gridColumns = [
    {
      field: 'sla_name',
      headerName: 'SLA Name',
      flex: 1,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
    },
    {
      field: 'criteria',
      headerName: 'Criteria',
      flex: 1,
    },
  ];

  document.title = 'New Incident Ticket ' + '- PiXELL-River';

  return (
    <>
      <Box p={4}>
        <FormTitle title={title} />
        <Typography variant="h5" color="#525252" align="center">
          {label}
        </Typography>
        <br />
        <SLADataGrid
          value={formData.slaId}
          handleInputChange={handleInputChange}
          gridColumns={gridColumns}
        />
      </Box>
    </>
  );
}
