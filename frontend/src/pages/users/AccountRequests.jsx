/* eslint-disable react/jsx-key */
import { Outlet } from 'react-router-dom';
import { Box, Chip, Stack, Typography } from '@mui/joy';
import { GridActionsCellItem } from '@mui/x-data-grid';
import moment from 'moment';

// Icons
import PreviewIcon from '@mui/icons-material/Preview';

import JoyDataGrid from '@/components/joy/JoyDataGrid';
import { Helmet } from 'react-helmet-async';
import useNavigateParams from '@/hooks/useNavigateParams';
import { useUsers } from '@/hooks/query/users/useUsers';

export default function AccountRequests() {
  const navigateSearch = useNavigateParams();
  const { status, isRefetching, data } = useUsers('unapproved');

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
      field: 'course_details',
      headerName: 'Section',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          {params.value.map((course) => (
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
      //flex: 1,
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
          icon={<PreviewIcon />}
          label="Review"
          onClick={() => navigateSearch(`review/${params.row.id}`)}
        />,
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Account Requests</title>
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
        <Typography level="h2">Account Requests</Typography>
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
