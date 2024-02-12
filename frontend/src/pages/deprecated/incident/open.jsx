import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { Axios } from '@/utils/Axios';
import FunctionDataGrid from '@/components/deprecated/UI/DataGrids/FunctionDatagrid';
import incidentColumns from '@/data/deprecated/incidentColumns';

import NoteIcon from '@mui/icons-material/Note';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import WarningIcon from '@mui/icons-material/Warning';

/**
 * Opens a page that lists all Open tickets in the Incidents table
 * @returns The Incident List of all Open tickets
 */
export default function OpenIncidentTicketsPage() {
  document.title = 'Open Incident Tickets - PiXELL-River';
  let currentUserRole = sessionStorage.getItem('roleId');
  const token = sessionStorage.getItem('access');
  const [counter, setCounter] = useState(3);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [slaData, setSlaData] = useState([]);

  useEffect(() => {
    getIncidents();
    getSLAs();
  }, []);

  useEffect(() => {
    if (open) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter, open]);

  /**
   * Fetch all the incidents from the database and set the state incidents
   */
  function getIncidents() {
    Axios({
      method: 'GET',
      url: '/api/incident/',
    })
      .then((response) => {
        const data = response.data;
        {
          setIncidents(data.filter((data) => data.status === 'Open'));
        }
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
   * Gets all SLAs related to Incident Tickets
   */
  function getSLAs() {
    Axios({
      method: 'GET',
      url: '/api/sla/',
    })
      .then((response) => {
        const data = response.data;

        setSlaData(data.filter((agreement) => (agreement.type = 'Incident')));
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
      <Typography level="h2" sx={{ marginBottom: '30px' }}>
        Open Incident Tickets
      </Typography>
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
          <>
            <Box
              sx={{
                height: '77vh',
                width: '100%',
                '& .Critical': {
                  backgroundColor: '#ffb3ba',
                  color: '#000',
                },
                '& .High': {
                  backgroundColor: '#ffdfba',
                  color: '#000',
                },
                '& .Medium': {
                  backgroundColor: '#ffffba',
                  color: '#000',
                },
                '& .Low': {
                  backgroundColor: '#baffc9',
                  color: '#000',
                },
              }}
            >
              <FunctionDataGrid
                rows={incidents}
                columns={incidentColumns(currentUserRole, slaData)}
              />
            </Box>
            <Box>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  width: '50vw',
                }}
              >
                <NoteIcon color="primary" /> - Attached to SLA{' '}
                <WarningIcon color="warning" /> - Attached SLA in Caution State{' '}
                <PriorityHighIcon color="error" /> - Attached SLA in Breach
                State
              </div>
            </Box>
          </>
        )}
      </>
    </>
  );
}
