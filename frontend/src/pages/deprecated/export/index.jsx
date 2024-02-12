import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Axios } from '@/utils/Axios';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';

export default function ExportPage() {
  const managementApiUrls = {
    'Incident Management': '/api/incident/',
    'Problem Management': '/api/problem/',
    'Asset Management': '/api/assets/',
    'Change Management': '/api/requests/',
    'SLA Management': '/api/sla/',
    'User Management': '/api/users/',
  };

  const token = sessionStorage.getItem('access');

  const managementOptions = Object.keys(managementApiUrls); // Get the list of management options

  const [selectedManagement, setSelectedManagement] = useState('');
  const [managementData, setManagementData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedManagement]);

  const handleManagementChange = (event) => {
    setSelectedManagement(event.target.value);
  };

  const fetchData = async () => {
    try {
      if (selectedManagement) {
        const response = await Axios({
          method: 'GET',
          url: managementApiUrls[selectedManagement],
        });
        const data = response.data;
        setManagementData(data); // Updating the state with the fetched data
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  const csvData = managementData.map((item) => {
    return {
      ...item,
    };
  });

  return (
    <Paper
      elevation={10}
      sx={{ width: '70%', margin: 'auto', my: '10vh', p: 2 }}
    >
      <Box p={2}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#525252"
          align="center"
          pb={3}
        >
          Export CSV
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Management</InputLabel>
          <Select
            value={selectedManagement}
            onChange={handleManagementChange}
            label="Select Management"
          >
            <MenuItem value="">
              <em>Select Management</em>
            </MenuItem>
            {managementOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Download CSV with Selected Management name*/}
        {selectedManagement && managementData.length > 0 && (
          <Box mt={3} display="flex" justifyContent="center">
            <CSVLink
              data={csvData}
              target="_blank"
              filename={`${selectedManagement}_data.csv`}
            >
              <Button variant="contained" color="primary">
                Download
              </Button>
            </CSVLink>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
