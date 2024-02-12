import React, { useEffect, useState } from 'react';
import { Axios } from '@/utils/Axios';

import { Grid, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import Loading from '@/components/deprecated/UI/Loading';

export default function PriorityDataGrid({
  value,
  handleInputChange,
  priorityError,
  children,
}) {
  const token = sessionStorage.getItem('access');

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const [selectedPriority, setSelectedPriority] = useState(value);

  const getPriorityData = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: '/api/priority/',
      });

      const data = await response.data;
      const columnNames = Object.keys(data[0]);

      const renameColumns = {
        [columnNames[2]]: 'Priority Name',
        [columnNames[3]]: 'Response Time',
        [columnNames[4]]: 'Resolution Time',
        [columnNames[5]]: 'Availablility',
      };

      const mappedColumns = [
        {
          field: columnNames[2],
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[2]] || columnNames[2],
          valueGetter: (params) => {
            const id = params.row.priority_id;
            return `(${id}) ${params.value}`;
          },
          flex: 1,
        },
        {
          field: columnNames[3],
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[3]] || columnNames[3],
          valueGetter: (params) => `${params.value} Hour(s)`,
          flex: 1,
        },
        {
          field: columnNames[4],
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[4]] || columnNames[4],
          valueGetter: (params) => `${params.value} Hours`,
          flex: 1,
        },
        {
          field: columnNames[5],
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[5]] || columnNames[5],
          flex: 1,
        },
      ];

      setColumns(mappedColumns);
      setData(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  const handleSelectedRow = (selectedRows) => {
    if (selectedRows.length > 0) {
      const selectedRow = data.find((row) => row.id === selectedRows[0]);
      if (selectedRow) {
        const selectedRowId = selectedRow.priority_id;
        setSelectedPriority(selectedPriority);
        handleInputChange({ priority: selectedRowId });
      }
    }
  };

  // Load Data in Grid
  useEffect(() => {
    const fetchData = async () => {
      await getPriorityData();
      setLoading(false);
    };

    fetchData();
  }, []);

  // Waits for data to be loaded
  if (loading) return <Loading />;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        sx={priorityError ? { borderColor: '#d32f2f' } : null}
        rows={data}
        getRowId={(row) => row.id}
        columns={columns}
        disableColumnSelector
        autoHeight
        value={selectedPriority}
        onSelectionModelChange={handleSelectedRow}
      />
      {children}
    </Box>
  );
}
