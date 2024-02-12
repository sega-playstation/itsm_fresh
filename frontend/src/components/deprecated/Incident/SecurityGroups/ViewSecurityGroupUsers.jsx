import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { ListItemButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import{  Axios } from '@/utils/Axios';
import { Link } from 'react-router-dom';

/**
 * Opens up a page that allows the user to see all users within the currently selected Security Group
 * @returns The DataGrid for viewing all users within a Security Group
 */
export default function ViewSecurityGroupUsers() {
  const query = new URLSearchParams(useLocation().search);
  const securityGroupId = query.get('securityGroupId');
  const token = sessionStorage.getItem('access');
  const [group, setGroup] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(3);
  const [open, setOpen] = useState(true);
  const columns = [
    {
      field: 'username',
      hideable: false,
      showable: false,
      headerName: 'Username',
      width: 180,
    },
    {
      field: 'first_name',
      hideable: false,
      showable: false,
      headerName: 'First Name',
      width: 200,
    },
    {
      field: 'last_name',
      hideable: false,
      showable: false,
      headerName: 'Last Name',
      width: 200,
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
          <Link to={`/users/view?userId=${cellValues.row.id}`}>
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
          <Link to={`/users/edit?userId=${cellValues.row.id}`}>
            <ListItemButton>
              <EditIcon />
            </ListItemButton>
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    getGroup();
    getUsers();
  }, []);

  useEffect(() => {
    if (open) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter, open]);

  /**
   * Fetches the groups and stores in a useState to display in datagrid.
   */
  function getGroup() {
    Axios({
      method: 'GET',
      url: `/api/securitygroups/${securityGroupId}/`,

    })
      .then((response) => {
        const data = response.data;
        setGroup(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  /**
   * Fetches all the users of the selected security group
   */
  function getUsers() {
    Axios({
      method: 'GET',
      url: `/api/securitygroupusers/?securitygroup=${securityGroupId}`,

    })
      .then((response) => {
        const data = response.data;
        setUsers(data);
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

  document.title =
    'Security Group ' + group.name + ': All Users ' + '- PiXELL-River';

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
            <h1>No Rows Found</h1>
          )}
        </div>
      ) : (
        <div style={{ height: 800, width: '100%' }}>
          <DataGrid
            rows={users}
            getRowId={(users) => users.id}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[15]}
            disableColumnSelector
            disableSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [
                  {
                    field: 'userId',
                    sort: 'desc',
                  },
                ],
              },
            }}
          />
        </div>
      )}
    </>
  );
}
