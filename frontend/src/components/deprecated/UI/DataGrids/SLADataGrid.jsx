import React, { useState, useEffect } from 'react';
import { Axios } from '@/utils/Axios';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Grid,
  Paper,
  BottomNavigation,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import Loading from '@/components/deprecated/UI/Loading';

export default function SLADataGrid({ handleInputChange, value, gridColumns }) {
  const token = sessionStorage.getItem('access');
  const [toggleStudentData, setToggleStudentData] = useState('False');

  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(3);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [sortModel, setSortModel] = useState([
    {
      field: 'number',
      sort: 'asc',
    },
  ]);

  const getSLA = () => {
    return Axios({
      method: 'GET',
      url: '/api/sla/',
    })
      .then((response) => {
        return response.data; // Return the response data
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        throw error;
      });
  };

  const mapSLAData = (data, gridColumns) => {
    const mappedColumns = gridColumns.map((column) => ({
      ...column,
    }));

    return { columns: mappedColumns, data: data };
  };

  const handleSelectedRow = (selectedRows) => {
    if (selectedRows.length > 0) {
      const selectedRow = data.find((row) => row.id === selectedRows[0]);
      if (selectedRow) {
        handleInputChange({ slaId: selectedRows[0] });
      }
    }
  };

  const handleChange = (event) => {
    setToggleStudentData(event.target.checked ? 'True' : 'False');
  };

  const showStudentSLA = () => {
    return (
      <FormControlLabel
        label={`Show Student SLA: ${toggleStudentData}`}
        control={<Checkbox onChange={handleChange} />}
      />
    );
  };

  useEffect(() => {
    getSLA()
      .then((responseData) => {
        const mappedData = mapSLAData(responseData, gridColumns);
        setColumns(mappedData.columns);
        setData(mappedData.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [toggleStudentData]);

  if (loading) {
    return <Loading />;
  }

  const handleStudentSLAButton = () => {
    switch (window.location.pathname) {
      case '/incident/new':
      case '/incident/edit':
        return (
          <Paper sx={{ bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation showLabels>{showStudentSLA()}</BottomNavigation>
          </Paper>
        );
      case '/sla/all':
        return (
          <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            elevation={3}
          >
            <BottomNavigation showLabels>{showStudentSLA()}</BottomNavigation>
          </Paper>
        );
      default:
        console.log('Invalid path');
        break;
    }
  };

  return (
    <Grid>
      <Box>
        <DataGrid
          rows={data}
          getRowId={(row) => row.id}
          columns={columns}
          pageSize={10}
          disableColumnSelector
          autoHeight
          sortModel={sortModel}
          onSortModelChange={(newModel) => setSortModel(newModel)}
          onSelectionModelChange={handleSelectedRow}
          selectionModel={value ? [value] : []}
        />
        {handleStudentSLAButton()}
      </Box>
    </Grid>
  );
}
