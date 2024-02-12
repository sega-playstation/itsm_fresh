import React, { useEffect, useState } from 'react';
import { Axios } from '@/utils/Axios';

import { Grid, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import Loading from '@/components/deprecated/UI/Loading';

export default function ChangeDataGrid() {
  const token = sessionStorage.getItem('access');

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const [sortModel, setSortModel] = useState([
    { field: 'requestDateTime', sort: 'desc' },
  ]);

  const fetchData = async (path) => {
    try {
      setLoading(true);
      const response = await Axios({
        method: 'GET',
        url: `/api/requests/`,
      });

      const data = await response.data;

      const handleData = () => {
        switch (window.location.pathname) {
          case '/change/pending':
            return data.filter((item) => item.status === 2);
          case '/change/approved':
            return data.filter((item) => item.status === 3);
          default:
            return data;
        }
      };

      const columnNames = Object.keys(data[0]);

      const renameColumns = {
        [columnNames[1]]: 'Ticket Number',
        [columnNames[2]]: 'Status',
        [columnNames[3]]: 'Project Name',
        [columnNames[4]]: 'Request Name',
        [columnNames[5]]: 'Request Type',
        [columnNames[6]]: 'Technician',
        [columnNames[7]]: 'Department',
        [columnNames[8]]: 'Priority',
        [columnNames[9]]: 'Request Date',
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
        {
          field: columnNames[2],
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[2]] || columnNames[2],
          flex: 1,
          renderCell: (cellValues) => {
            const status = getStatusString(cellValues.value);
            return <Typography variant="body2">{status}</Typography>;
          },
        },
        ...columnNames.slice(3, 9).map((columnName) => ({
          field: columnName,
          hideable: false,
          showable: false,
          headerName: renameColumns[columnName] || columnName,
          flex: 1,
        })),
        {
          field: columnNames[9],
          hideable: false,
          showable: false,
          headerName: renameColumns[columnNames[9]] || columnNames[9],
          flex: 1,
          renderCell: (cellValues) => {
            const formattedDate = formatDate(cellValues.value);
            return <Typography variant="body2">{formattedDate}</Typography>;
          },
        },
        {
          field: 'View',
          hideable: false,
          showable: false,
          width: 60,
          headerAlign: 'center',
          align: 'center',
          renderCell: (cellValues) => {
            return (
              <Link to={`/change/view?requestId=${cellValues.row.id}`}>
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
          showable: false,
          width: 60,
          headerAlign: 'center',
          align: 'center',
          renderCell: (cellValues) => {
            return (
              <Link to={`/change/edit?requestId=${cellValues.row.id}`}>
                <ListItemButton>
                  <EditIcon />
                </ListItemButton>
              </Link>
            );
          },
        },
      ];

      setColumns(mappedColumns);
      setData(handleData());
      setLoading(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  const getStatusString = (status) => {
    switch (status) {
      case 1:
        return 'Open';
      case 2:
        return 'Pending';
      case 3:
        return 'Approved';
      default:
        return null;
    }
  };

  // Formats the date
  function formatDate(dateString) {
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

  useEffect(() => {
    fetchData(window.location.pathname);
  }, [window.location.pathname]);

  if (loading) return <Loading />;

  return (
    <Grid container item xs={12} style={{ height: '100%' }}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={data}
          getRowId={(row) => row.id}
          columns={columns}
          disableColumnSelector
          sortModel={sortModel}
          onSortModelChange={(newModel) => setSortModel(newModel)}
        />
      </Box>
    </Grid>
  );
}
