import React from 'react';
import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';
import { Box, Button, Paper, Typography } from '@mui/material';
import{  Axios } from '@/utils/Axios';

export default function CsvImporter() {
  const handleImportData = async (rows) => {
    console.log('Imported data:', rows);

    for (const user of rows) {
      // Get role_id by role name
      let role_id;
      try {
        const roleResponse = await Axios.get(`/api/roles/?name=${user.role}`);
        role_id = roleResponse.data.id;
      } catch (error) {
        console.error(`Error getting role ID for role ${user.role}: `, error);
      }

      // Get course_id_id by course name
      let course_id_id;
      try {
        const courseResponse = await Axios.get(
          `/api/courses/?name=${user.section}`,
        );
        course_id_id = courseResponse.data.id;
      } catch (error) {
        console.error(
          `Error getting course ID for course ${user.section}: `,
          error,
        );
      }

      // Create a new user object
      const newUser = {
        first_name: user.firstName,
        last_name: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
        approved: user.approved === 'TRUE',
        role_id: role_id, // Use role_id instead of role
        course_id_id: course_id_id, // Use course_id_id instead of course_id
      };

      try {
        // Create a new user
        const response = await Axios.post('/api/users/', newUser);
        const createdUser = response.data;
        console.log(`User ${user.username} created successfully.`);

        // Get the security group names for this user from the CSV file
        const securityGroupNames = user.securityGroups.split(',');

        // Initialize an empty array for storing the IDs of the security groups
        const securityGroupIds = [];

        for (const groupName of securityGroupNames) {
          // Replace '/api/securitygroups/' with your actual API endpoint for the SecurityGroup model
          const response = await Axios.get(
            `/api/securitygroups/?name=${groupName}`,
          );
          const group = response.data;

          // Add this group's ID to the array of security group IDs
          securityGroupIds.push(group.id);
        }

        // Assign these groups to the user
        // Replace '/api/users/' with your actual API endpoint for the User model
        await Axios.put(`/api/users/${createdUser.id}/`, {
          security_group: securityGroupIds,
        });

        console.log(
          `Security groups for user ${user.username} assigned successfully.`,
        );
      } catch (error) {
        console.error(`Error creating user ${user.username}: `, error);
      }
    }
  };

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
          Quick User Imports
        </Typography>
        <Importer
          dataHandler={handleImportData}
          defaultNoHeader={false}
          restartable={false}
        >
          <ImporterField name="firstName" label="First Name" />
          <ImporterField name="lastName" label="Last Name" />
          <ImporterField name="username" label="Username" />
          <ImporterField name="email" label="Email Address" />
          <ImporterField name="password" label="Password" />
          <ImporterField name="approved" label="Approved" />
          <ImporterField name="role" label="Role" />
          <ImporterField name="courseId" label="Section" />
          <ImporterField name="securityGroup" label="Security Groups" />
        </Importer>
        {/* <Box mt={2}>
            <MuiLink component={Link} to="/instructions">View Instructions</MuiLink>
        </Box> */}
      </Box>
    </Paper>
  );
}
