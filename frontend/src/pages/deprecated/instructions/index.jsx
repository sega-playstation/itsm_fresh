import { Typography } from '@mui/material';

export default function InstructionsPage() {
  return (
    <>
      <Typography variant="h4" align="center">
        Instructions for Imports
        <br />
      </Typography>
      {/* Add your instructions here */}
      <Typography variant="h5" align="left">
        Incidents Importing
        <br />
      </Typography>
      <Typography variant="body1">
        'User', 'Ticket Created By' and 'Assigned Technician' fields must be
        currently existing users stored in the database.<br></br>
        Date requires an apostrophe ( ' ) preceeding the year and it needs to
        have exactly one space and no more than one space in between date, hour
        and AM/PM.<br></br>
        Date also requires all components as showed in the example with a format
        04:20:30 PM.<br></br>
        The category and type must be existing categories in the database and
        must be separated by a - with no spaces. <br></br>
        For example 'I'nquiry / Help-Antivirus' is a valid ticket type where
        'Inquiry / Help' is a category of two words stored in the database and
        'Antivirus' is<br></br>a type stored in the database as well and they go
        separated by a - with no spaces. <br></br>
        Talk to you administrator about adding more categories and types, if
        those require two words they must be separated by a / in your DB like
        'ADD / WebServer' could be a type.<br></br>
        Security Group must exist in DB as well.
        <img src="/images/incidentsCSV2.png" alt="Incident CSV file" />
      </Typography>
      <Typography variant="body1">Step 2: Do that...</Typography>
      {/* Add as many steps as needed*/}
    </>
  );
}
