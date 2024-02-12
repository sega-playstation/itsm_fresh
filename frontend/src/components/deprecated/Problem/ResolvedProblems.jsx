import React from 'react';
import { Axios } from '@/utils/Axios';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import WarningIcon from '@mui/icons-material/Warning';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import FunctionDataGrid from '@/components/deprecated/UI/DataGrids/FunctionDatagrid';
//import { problemadminColumns, problemstudentColumns } from "../../lib/problemColumns";
import problemColumns from '@/data/deprecated/problemColumns';

/**
 * Default Export function for the ProblemDataGrid listing all the problem tickets
 */
function ResolvedProblems() {
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [slaData, setSlaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(3);
  const [open, setOpen] = useState(true);

  const token = sessionStorage.getItem('access');

  document.title = 'Resolved Problem Tickets ' + '- PiXELL-River';

  let currentUserId = sessionStorage.getItem('userId');
  let currentUserRole = sessionStorage.getItem('roleId');
  let currentUserSection = sessionStorage.getItem('section');

  useEffect(() => {
    getProblems();
    getSLAs();
  }, []);

  useEffect(() => {
    if (open) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter, open]);

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
        setProblems(data.filter((data) => data.status === 'Resolved'));
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
                width: '50vw',
              }}
            >
              <NoteIcon color="primary" /> - Attached to SLA{' '}
              <WarningIcon color="warning" /> - Attached SLA in Caution State{' '}
              <PriorityHighIcon color="error" /> - Attached SLA in Breach State
            </div>
          </Box>
        </>
      )}
    </>
  );
}

export default ResolvedProblems;
