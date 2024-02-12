import React, { useEffect, useState } from 'react';
import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Collapse,
  Grid,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';
import { Axios } from '@/utils/Axios';
import { useLocation } from 'react-router-dom';
import FunctionDataGrid from '@/components/deprecated/UI/DataGrids/FunctionDatagrid';
import { viewProblemRelatedColumn } from '@/data/deprecated/incidentColumns';
/**
 * Dependencies dropdown form component for checking the incident dependencies
 * Parent component: CreateProblem
 */
const ViewDependencies = (props) => {
  const [open, setOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('access');
  const [problemData, setProblemData] = useState([props.problems.problemId]);
  const query = new URLSearchParams(useLocation().search);
  const problemId = query.get('problemId');
  const [counter, setCounter] = useState(5);
  const [users, setUsers] = useState(props.users);
  const currentUserRole = sessionStorage.getItem('roleId');

  const getProblems = async () => {
    try {
      const response = await Axios.get(
        `/api/problemsRelatedRetrieve/?problemsRelated=${problemId}`
      );
      const data = await response.data;
      setIncidents(data);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  useEffect(() => {
    getProblems();
  }, []);

  useEffect(() => {
    if (incidents.length) {
      setLoading(false);
    }
  });

  const handleCollapse = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 1200,
        color: 'black',
        bgcolor: 'lightgray',
        borderRadius: 2,
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
        ></ListSubheader>
      }
    >
      <ListItemButton onClick={handleCollapse}>
        <ListItemText primary="Related Items" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          p={4}
          component="div"
          disablePadding
          sx={{
            color: 'black',
            bgcolor: '#ffebee',
            border: 0,
            borderColor: 'primary.main',
          }}
        >
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
            <Grid>
              <div style={{ height: 400, width: '100%' }}>
                <FunctionDataGrid
                  rows={incidents}
                  columns={viewProblemRelatedColumn}
                />
              </div>
            </Grid>
          )}
        </Box>
      </Collapse>
    </List>
  );
};

export default ViewDependencies;
