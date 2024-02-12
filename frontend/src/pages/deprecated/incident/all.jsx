import React from 'react';
import IncidentListDataGrid from '@/components/deprecated/UI/DataGrids/IncidentListDataGrid';

import { Typography } from '@mui/joy';

/**
 * Opens up a page with all Incident Tickets listed in a DataGrid within the Sidebar
 * @returns A DataGrid of all Incident Tickets based off the user's role
 */
export default function IncidentsPage() {
  document.title = 'All Incident Tickets - PiXELL-River';

  return (
    <>
      <Typography level="h2" sx={{ marginBottom: '30px' }}>
        Incident Tickets
      </Typography>
      <IncidentListDataGrid />
    </>
  );
  /* <Box>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Box
          style={{
            "align-self": "flex-end",
            paddingTop: 10,
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            component="a"
            sx={{ width: "10.5vw" }}
            href="/import"
            color="primary"
          >
            Import Incidents
          </Button>
          <Button
            component="a"
            sx={{ width: "10.5vw" }}
            href="/export"
            color="primary"
          >
            Export Incidents
          </Button>
        </Box>
      </div>
    </Box> */
}
