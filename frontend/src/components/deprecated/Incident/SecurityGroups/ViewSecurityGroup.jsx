import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ListItemButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import{  Axios } from '@/utils/Axios';
import { Link } from 'react-router-dom';

/**
 * Opens up a DataGrid of all current Security Groups for the user to view
 * @returns The DataGrid of all current Security Groups
 */
export default function ViewSecurityGroup() {
  let token = sessionStorage.getItem('access');
  const [counter, setCounter] = useState(3);
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  /**
   * Column data used to display the security groups data grid.
   */
  const columns = [
    {
      field: 'name',
      hideable: false,
      showable: false,
      headerName: 'Name',
      width: 340,
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
          <Link
            to={`/incident/securitygroup/view?securityGroupId=${cellValues.row.securityGroupId}`}
          >
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
          <Link
            to={`/incident/securitygroup/edit?securityGroupId=${cellValues.row.securityGroupId}`}
          >
            <ListItemButton>
              <EditIcon />
            </ListItemButton>
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    getGroups();
  }, [group.length]);

  useEffect(() => {
    if (open) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter, open]);

  /**
   * Fetches the groups and stores in a useState to display in datagrid.
   */
  function getGroups() {
    Axios({
      method: 'GET',
      url: '/api/securitygroups/',

    })
      .then((response) => {
        const data = response.data;
        setGroup(data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  return (
    <>
      {loading ? (
        <div className="spinner">
          {counter !== 0 ? (
            <>
              <span>Loading. . .</span>
              <div className="half-spinner"></div>
            </>
          ) : (
            <h1>No Groups Found</h1>
          )}
        </div>
      ) : (
        <DataGrid
          rows={group}
          getRowId={(group) => group.securityGroupId}
          sx={{
            height: 400,
          }}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableColumnSelector
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [
                {
                  field: 'securityGroupId',
                  sort: 'asc',
                },
              ],
            },
          }}
        />
      )}
    </>
  );
}
