import { Grid } from '@mui/material';
import { ListItemButton, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import SLADataGrid from '@/components/deprecated/UI/DataGrids/SLADataGrid';

export default function SLAListPage() {
  // Define the Columns Here
  const gridColumns = [
    {
      field: 'number',
      headerName: 'SLA Number',
      valueGetter: (params) => `${params.value}`.slice(0, 8),
      flex: 1,
    },
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
      field: 'response_time',
      headerName: 'Response Time',
      flex: 1,
      valueGetter: (params) => `${params.value} Hour(s)`,
    },
    {
      field: 'resolution_time',
      headerName: 'Resolution Time',
      flex: 1,
      valueGetter: (params) => `${params.value} Hour(s)`,
    },
    {
      field: 'availability',
      headerName: 'Availability',
      flex: 1,
    },
    {
      field: 'criteria',
      headerName: 'Criteria',
      flex: 1,
    },
    {
      field: 'View',
      hideable: false,
      showable: false,
      width: 60,
      headerAlign: 'center',
      align: 'center',
      renderCell: (cellValues) => {
        return (
          <Link to={`/sla/view?slaId=${cellValues.row.id}`}>
            <ListItemButton>
              <VisibilityIcon />
            </ListItemButton>
          </Link>
        );
      },
    },
    {
      field: 'Edit',
      hideable: false,
      showable: false,
      width: 60,
      headerAlign: 'center',
      align: 'center',
      renderCell: (cellValues) => {
        return (
          <Link to={`/sla/edit?slaId=${cellValues.row.id}`}>
            <ListItemButton>
              <EditIcon />
            </ListItemButton>
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <Grid>
        <SLADataGrid gridColumns={gridColumns} />
      </Grid>
      <Box
        style={{ float: 'right', paddingTop: 10, display: 'flex', gap: '10px' }}
      >
        <Button
          sx={{ width: '10.5vw' }}
          href="/import"
          variant="contained"
          color="primary"
        >
          Import SLA
        </Button>
        <Button
          sx={{ width: '10.5vw' }}
          href="/export"
          variant="contained"
          color="primary"
        >
          Export SLA
        </Button>
      </Box>
    </>
  );
}
