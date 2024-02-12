import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Grid, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link, ListItemButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import Loading from '../Loading';

export default function AssetDataGrid({
  token,
  name,
  value,
  url,
  checkboxSelection,
  handleInputChange,
  readOnly,
}) {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const [selectedAssets, setSelectedAssets] = useState(value ? [value] : []);

  const [sortModel, setSortModel] = useState([
    { field: 'asset_number', sort: 'desc' },
  ]);

  const getAssets = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/assets/${url ? url : ''}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.data;
      const columnNames = Object.keys(data[0]);

      const renameColumns = {
        [columnNames[1]]: 'Asset Number',
        [columnNames[2]]: 'Serial Number',
        [columnNames[3]]: 'Name',
        [columnNames[4]]: 'Category',
        [columnNames[5]]: 'IP Address',
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
        ...columnNames.slice(2, 6).map((columnName) => ({
          field: columnName,
          hideable: false,
          showable: false,
          headerName: renameColumns[columnName] || columnName,
          flex: 1,
        })),
        ...(window.location.pathname === '/asset/all'
          ? [
              {
                field: 'View',
                hideable: false,
                width: 60,
                headerAlign: 'center',
                align: 'center',
                renderCell: (cellValues) => {
                  return (
                    <Link href={`/asset/view?assetId=${cellValues.row.id}`}>
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
                width: 60,
                headerAlign: 'center',
                align: 'center',
                renderCell: (cellValues) => {
                  return (
                    <Link href={`/asset/edit?assetId=${cellValues.row.id}`}>
                      <ListItemButton>
                        <EditIcon />
                      </ListItemButton>
                    </Link>
                  );
                },
              },
            ]
          : []),
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

  const handleSelectedRow = (selectedRows) => {
    if (!readOnly) {
      setSelectedAssets(selectedAssets);
      handleInputChange({ [name]: selectedRows });
    }
  };

  // Load Data in Grid
  useEffect(() => {
    getAssets();
  }, []);

  // Waits for data to be loaded
  if (loading) return <Loading />;

  return (
    <Grid container item xs={12} style={{ height: '100%' }}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={data}
          getRowId={(row) => row.id}
          columns={columns}
          disableColumnSelector
          checkboxSelection={checkboxSelection ? checkboxSelection : false}
          selectionModel={value}
          sortModel={sortModel}
          onSortModelChange={(newModel) => setSortModel(newModel)}
          onSelectionModelChange={handleSelectedRow}
          readOnly={readOnly ? readOnly : false}
        />
      </Box>
    </Grid>
  );
}
