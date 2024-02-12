/* eslint-disable react/jsx-key */
import { Outlet } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/joy';
import { GridActionsCellItem } from '@mui/x-data-grid';
// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import JoyDataGrid from '@/components/joy/JoyDataGrid';
import { Helmet } from 'react-helmet-async';
import useNavigateParams from '@/hooks/useNavigateParams';
import { useCourses } from '@/hooks/query/courses/useCourses';

export default function Sections() {
  const navigateSearch = useNavigateParams();
  const { status, data } = useCourses();

  const columns = [
    {
      field: 'name',
      headerName: 'Course',
      flex: 1,
    },
    {
      field: 'term',
      headerName: 'Term',
      flex: 1,
    },
    {
      field: 'year',
      headerName: 'Year',
      flex: 1,
    },
    {
      field: 'section',
      headerName: 'Section',
      flex: 1,
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
        <title>Sections</title>
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
        <Typography level="h2">Sections</Typography>
        <Button
          color="primary"
          startDecorator={<AddCircleIcon />}
          size="sm"
          onClick={() => navigateSearch('add')}
        >
          New Section
        </Button>
      </Box>

      <JoyDataGrid
        rows={data || []}
        density="compact"
        getRowId={(sections) => sections.id}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        disableColumnSelector
        loading={status === 'pending'}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: 'sectionId',
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
