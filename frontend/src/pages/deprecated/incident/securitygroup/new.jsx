import { useState } from 'react';
import { Box, Paper, TextField, Button } from '@mui/material';
import { Axios } from '@/utils/Axios';
import ViewSecurityGroup from '@/components/deprecated/Incident/SecurityGroups/ViewSecurityGroup';

/**
 * Opens a page that allows a user to create a new Security Group as well as see all past Security Groups
 * @returns The layout for the New Security Group Page within the Sidebar
 */
export default function NewSecurityGroupPage() {
  let token = sessionStorage.getItem('access');
  const [group, setGroup] = useState('');
  const [secGroupError, setSecGroupError] = useState('');

  function createGroup() {
    if (!group) {
      setSecGroupError('Security Group is required!');
      return;
    }

    Axios({
      method: 'POST',
      url: '/api/securitygroups/',

      data: {
        name: group,
      },
    })
      .then((response) => {
        window.location.href = '/incident/securitygroup/new';
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function handleChangeField(event) {
    setGroup(event.target.value);
    setSecGroupError('');
  }

  return (
    <>
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
          <h2>New Security Group</h2>
        </Box>

        <Box
          sx={{
            width: '100%',
          }}
        >
          <TextField
            error={secGroupError !== ''}
            required
            fullWidth
            type="text"
            name="secGroup"
            margin="normal"
            label="Security Group"
            variant="outlined"
            id="secGroup"
            onChange={handleChangeField}
            helperText={secGroupError}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={createGroup}
          >
            Create
          </Button>
        </Box>

        <Box
          sx={{
            mt: '5vh',
            height: '100%',
            width: '100%',
          }}
        >
          <ViewSecurityGroup />
        </Box>
      </Paper>
    </>
  );
}
