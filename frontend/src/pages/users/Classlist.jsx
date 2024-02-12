/* eslint-disable react/jsx-key */
import { Outlet } from 'react-router-dom';
import { Stack, Typography as T } from '@mui/joy';

import JoyDataGrid from '@/components/joy/JoyDataGrid';
import { Helmet } from 'react-helmet-async';
import { useContext } from 'react';
import UserContext from '@/components/UserContext';
import { useUsers } from '@/hooks/query/users/useUsers';
import { useCourses } from '@/hooks/query/courses/useCourses';

export default function Classlist() {
  const { user, selectedCourse } = useContext(UserContext);
  const { status, isRefetching, data } = useUsers('all', selectedCourse);
  const { status: courseStatus, data: courseData } = useCourses();

  const columns = [
    {
      field: 'full_name',
      headerName: 'Name',
      width: 300,
      valueGetter: (params) => {
        return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 300,
    },
    {
      field: 'role_name',
      headerName: 'Role',
      flex: 1,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Classlist</title>
      </Helmet>
      <Stack direction="column" spacing={4} sx={{ height: '100%' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <T level="h2">Classlist</T>
            <T level="h3" color="neutral">
              {courseStatus !== 'pending' &&
                [
                  courseData.find((course) =>
                    selectedCourse
                      ? course.id === selectedCourse
                      : course.id === user.courseId[0],
                  ),
                ].map((course) => course.section + ' -  ' + course.name)}
            </T>
          </Stack>
        </Stack>

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
      </Stack>

      <Outlet />
    </>
  );
}
