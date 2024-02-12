import React, { useEffect, useState } from 'react';

import { Grid, Box, Typography } from '@mui/joy';
import { GridActionsCellItem } from '@mui/x-data-grid';

import { Link as RouterLink } from 'react-router-dom';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import JoyDataGrid from '@/components/joy/JoyDataGrid';

export default function IncidentListDataGrid() {
  const token = sessionStorage.getItem('access');

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [sortModel, setSortModel] = useState([
    { field: 'ticketDateTime', sort: 'desc' },
  ]);

  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const getIncidentData = async () => {
    try {
      const response = await fetch('/api/incident/', {
        method: 'GET',
      });

      const data = await response.json();
      const columnNames = Object.keys(data[0]);

      const renameColumns = {
        [columnNames[1]]: 'Ticket',
        [columnNames[2]]: 'Opened By',
        [columnNames[3]]: 'User',
        [columnNames[4]]: 'Status',
        [columnNames[5]]: 'Priority',
        [columnNames[6]]: 'Assigned To',
        [columnNames[7]]: 'Description',
        [columnNames[9]]: 'Report Date',
      };

      const mappedColumns = [
        {
          field: columnNames[1],
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[1]] || columnNames[1],
          valueGetter: (params) => `${params.value}`.slice(0, 8),
          width: 125,
        },
        ...columnNames.slice(2, 7).map((columnName) => ({
          field: columnName,
          hideable: false,
          showable: false,
          headerName: renameColumns[columnName] || columnName,
          width: 150,
        })),
        {
          field: columnNames[7],
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[7]] || columnNames[7],
          flex: 1,
        },
        {
          field: columnNames[9],
          type: 'dateTime',
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[9]] || columnNames[9],
          flex: 1,
          valueGetter: ({ value }) => value && new Date(value),
          valueFormatter: (params) => {
            return params.value.toLocaleString('en-US', dateFormatOptions);
          },
        },
        {
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              component={RouterLink}
              icon={<VisibilityIcon />}
              to={`/incident/view?incidentId=${params.row.id}`}
              label="View"
            />,
            <GridActionsCellItem
              component={RouterLink}
              icon={<EditIcon />}
              to={`/incident/edit?incidentId=${params.row.id}`}
              label="Edit"
            />,
          ],
        },
      ];

      setColumns(mappedColumns);
      setData(data);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  useEffect(() => {
    getIncidentData();
  }, []);

  return (
    <JoyDataGrid
      rows={data}
      density="compact"
      getRowId={(row) => row.id}
      columns={columns}
      disableColumnSelector
      disableColumnMenu
      sortModel={sortModel}
      onSortModelChange={(newModel) => setSortModel(newModel)}
      loading={loading}
    />
  );
}
