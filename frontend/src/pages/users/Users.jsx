/* eslint-disable react/jsx-key */
import { Outlet } from 'react-router-dom';
import { Box, Button, Chip, Stack, Typography } from '@mui/joy';
import { GridActionsCellItem } from '@mui/x-data-grid';
import moment from 'moment';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import JoyDataGrid from '@/components/joy/JoyDataGrid';
import { Helmet } from 'react-helmet-async';
import useNavigateParams from '@/hooks/useNavigateParams';
import { useUsers } from '@/hooks/query/users/useUsers';

export default function Users() {
  const navigateSearch = useNavigateParams();
  const { status, isRefetching, data } = useUsers('all');

  const columns = [
    {
      field: 'full_name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'role_name',
      headerName: 'Role',
      flex: 1,
    },
    {
      field: 'course_details',
      headerName: 'Sections',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          {params.value &&
            params.value.map((course) => (
              <Chip key={`course-${course.id}`} variant="outlined" size="sm">
                {`${course.term}${course.year}-${course.section}`}
              </Chip>
            ))}
        </Stack>
      ),
    },
    {
      field: 'dateCreated',
      headerName: 'Created',
      width: 200,
      headerAlign: 'left',
      align: 'left',
      valueGetter: (params) => moment(params.row.date_joined).toDate(),
      valueFormatter: (params) =>
        moment(params.value).format('MMM Do YYYY, h:mm a'),
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => navigateSearch(`${params.row.id}`)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => navigateSearch(`edit/${params.row.id}`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => navigateSearch(`delete/${params.row.id}`)}
        />,
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          my: 1,
          mb: '30px', // TODO: temp
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2">Users</Typography>

        <Button
          color="primary"
          startDecorator={<AddCircleIcon />}
          size="sm"
          onClick={() => navigateSearch('add')}
        >
          New User
        </Button>
      </Box>

      <JoyDataGrid
        rows={data || []}
        density="compact"
        getRowId={(users) => users.id}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        disableColumnSelector
        loading={status === 'pending' || isRefetching}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: 'dateCreated',
                sort: 'desc',
              },
            ],
          },
        }}
      />

      <Outlet />
    </>
  );
}
