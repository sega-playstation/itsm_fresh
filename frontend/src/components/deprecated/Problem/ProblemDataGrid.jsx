import React from 'react';
import { Axios } from '@/utils/Axios';
import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import WarningIcon from '@mui/icons-material/Warning';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import FunctionDataGrid from '@/components/deprecated/UI/DataGrids/FunctionDatagrid';
//import { problemadminColumns, problemstudentColumns } from "../../lib/problemColumns";
import problemColumns from '@/data/deprecated/problemColumns';

/**
 * Default Export function for the ProblemDataGrid listing all the problem tickets
 */
function ProblemDataGrid() {
  const [open, setOpen] = useState(true);
  const [problems, setProblems] = useState();
  const [slaData, setSlaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(3);

  const token = sessionStorage.getItem('access');

  document.title = 'All Problem Tickets - PiXELL-River';

  let currentUserRole = sessionStorage.getItem('roleId');

  /**
   * Fetch all the problems from the database and set the state problems
   */
  function getProblems() {
    Axios({
      method: 'GET',
      url: '/api/problem/',
    })
      .then((response) => {
        const data = response.data;
        setProblems(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function getSLAs() {
    Axios({
      method: 'GET',
      url: '/api/sla/',
    })
      .then((response) => {
        const data = response.data;

        setSlaData(data.filter((agreement) => (agreement.type = 'Problem')));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  useEffect(() => {
    getProblems();
    getSLAs();
  }, []);

  useEffect(() => {
    if (problems) {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (open) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter, open]);

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
              rows={problems}
              columns={problemColumns(currentUserRole, slaData)}
            />
          </Box>
          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  width: '50vw',
                }}
              >
                <NoteIcon color="primary" /> - Attached to SLA{'   '}
                <WarningIcon color="warning" /> - Attached SLA in Caution State
                {'   '}
                <PriorityHighIcon color="error" /> - Attached SLA in Breach
                State{'   '}
              </div>
              <Box
                style={{
                  float: 'right',
                  paddingTop: 10,
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <Button
                  sx={{ width: '10.5vw' }}
                  href="/import"
                  variant="contained"
                  color="primary"
                >
                  Import Problems
                </Button>
                <Button
                  sx={{ width: '10.5vw' }}
                  href="/export"
                  variant="contained"
                  color="primary"
                >
                  Export Problems
                </Button>
              </Box>
            </div>
          </Box>
        </>
      )}
    </>
  );
}

export default ProblemDataGrid;