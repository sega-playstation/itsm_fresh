import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, Paper, TextField } from '@mui/material';
import{  Axios } from '@/utils/Axios';

/**
 * Opens a page that allows the user to edit the currently selected Security Group
 * @returns The form for the user to change the Security Group's name
 */
export default function EditSecurityGroup() {
  const query = new URLSearchParams(useLocation().search);
  const securityGroupId = query.get('securityGroupId');
  const token = sessionStorage.getItem('access');
  const [group, setGroup] = useState([]);
  const [newGroup, setNewGroup] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroups();
  }, [group.length]);

  /**
   * Fetches the groups and stores in a useState to display in datagrid.
   */
  function getGroups() {
    Axios({
      method: 'GET',
      url: `/api/securitygroups/${securityGroupId}/`,

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

  /**
   * Updates the currently selected Security Group
   * @param {*} event
   */
  function updateGroup(event) {
    Axios({
      method: 'PATCH',

      data: {
        name: String(newGroup.secGroup),
      },
    }).then((response) => {
      window.location.href = '/incident/securitygroup/new';
    });
    event.preventDefault();
  }

  /**
   * Handle onChange for subject and details field
   */
  function handleChangeField(event) {
    const { name, value } = event.target;
    setNewGroup((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
  }

  document.title = 'Edit Security Group: ' + group.name + ' - PiXELL-River';

  return (
    <>
      {loading ? (
        <div className="spinner">
          <span>Loading. . .</span>
          <div className="half-spinner"></div>
        </div>
      ) : (
        <Paper
          elevation={10}
          sx={{
            mt: '10vh',
            mx: 'auto',
            textAlign: 'center',
            px: 8,
            py: 3,
            width: '50%',
          }}
        >
          <Box>
            <h2>Edit Security Group</h2>
          </Box>

          <Box
            sx={{
              height: '100%',
              width: '100%',
            }}
          >
            <TextField
              required
              id="secGroup"
              label="Security Group"
              variant="filled"
              fullWidth
              defaultValue={String(group.name)}
              name="secGroup"
              onChange={handleChangeField}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              type="button"
              color="primary"
              variant="contained"
              onClick={updateGroup}
            >
              Update
            </Button>
          </Box>

          <Box
            sx={{
              mt: '5vh',
              height: '100%',
              width: '100%',
            }}
          ></Box>
        </Paper>
      )}
    </>
  );
}
