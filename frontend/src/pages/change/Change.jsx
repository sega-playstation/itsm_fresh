/* eslint-disable react/jsx-key */

import DataGridPage from '@/components/layout/DataGridPage';
import JoyDataGrid from '@/components/joy/JoyDataGrid';
import { GridActionsCellItem } from '@mui/x-data-grid';
import useNavigateParams from '@/hooks/useNavigateParams';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAssets } from '@/hooks/query/assets/useAssets';
import { useContext } from 'react';
import UserContext from '@/components/UserContext';
import { UserRole } from '@/utils/enums';
import { startCase, toLower } from 'lodash';

export default function Assets() {
  const { user, selectedCourse } = useContext(UserContext);
  const { status, isRefetching, data } = useAssets(
    user.roleId !== UserRole.ADMIN ? selectedCourse : undefined,
  );
  const navigateSearch = useNavigateParams();

  const columns = [
    {
      field: 'asset_tag',
      headerName: 'Asset Number',
      flex: 1,
      valueFormatter: (params) => {
        if (params.value === null) {
          return '';
        }
        return 'AST-' + String(params.value).padStart(5, '0');
      },
    },
    {
      field: 'serial_number',
      headerName: 'Serial Number',
      flex: 1,
    },
    {
      field: 'asset_name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      valueFormatter: (params) => {
        if (params.value === null) {
          return '';
        }
        return startCase(toLower(params.value));
      },
    },
    {
      field: 'ip_address',
      headerName: 'IP Address',
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
    <DataGridPage
      title="Assets"
      ActionIcon={AddCircleIcon}
      actionLabel="New Asset"
      actionTo="add"
      element={
        <JoyDataGrid
          rows={data || []}
          columns={columns}
          density="compact"
          getRowId={(row) => row.id}
          disableSelectionOnClick
          disableColumnSelector
          loading={status === 'pending' || isRefetching}
          initialState={{
            sorting: {
              sortModel: [
                {
                  field: 'asset_tag',
                  sort: 'desc',
                },
              ],
            },
          }}
        />
      }
    />
  );
}
