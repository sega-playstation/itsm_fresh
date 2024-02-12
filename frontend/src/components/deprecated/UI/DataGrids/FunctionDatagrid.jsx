import React from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';
import {
  getDateFormat,
  getTicketNumber,
} from '@/data/deprecated/problemColumns';

function FunctionDataGrid({ rows, columns }) {
  return (
    <DataGrid
      rows={rows}
      getRowId={(rows) => rows.id}
      columns={columns}
      pageSize={15}
      rowsPerPageOptions={[15]}
      disableSelectionOnClick
      initialState={{
        sorting: {
          sortModel: [
            {
              field: columns[0].field,
              sort: 'desc',
            },
          ],
        },
      }}
      disableColumnSelector
    />
  );
}
export default FunctionDataGrid;
