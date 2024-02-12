import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TextField,
  Box,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Grid,
} from '@mui/material';
import { Axios } from '@/utils/Axios';
// import ProblemComments from "./ProblemComments";
import '@/styles/deprecated/preloader3.css';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ViewDependencies from './Incident_Dependencies/ViewDependencies';

const marks = [
  {
    value: 1,
    label: '1 - Critical',
  },
  {
    value: 2,
    label: '2 - High',
  },
  {
    value: 3,
    label: '3 - Medium',
  },
  {
    value: 4,
    label: '4 - Low',
  },
];

function valuetext(value) {
  return `${value}`;
}

function valueLabelFormat(value) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

/**
 * Default Export function for viewing problem ticket
 * Child components: ProblemComments
 */
function ViewProblem() {
  const query = new URLSearchParams(useLocation().search);
  const problemId = query.get('problemId');
  const ticketNumber = 'PRB' + problemId.toString().padStart(6, '0');
  const currentUserRole = sessionStorage.getItem('roleId');
  const [loading, setLoading] = useState(true);
  const [problemData, setProblemData] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [user, setUser] = useState();
  const [userList, setUserList] = useState([]);
  const [slaData, setSlaData] = useState([]);
  const [isMultipleAffected, setIsMultipleAffected] = useState(false);
  const [impact, setImpact] = useState(4);
  const [urgency, setUrgency] = useState(4);
  const [priority, setPriority] = useState(4);
  const currentDate = new Date();
  const [reportDateTime, setReportDateTime] = useState(new Date());
  const [technician, setTechnician] = useState();
  const [technicianList, setTechnicianList] = useState([]);
  const [activeStatus, setActiveStatus] = React.useState(0);
  const [ticket, setTicket] = useState({
    summary: '',
    details: '',
    affectedUserSize: '',
  });
  const [tickNum, setTickNum] = useState([]);
  const ticketNum = 'PRB' + tickNum.toString().padStart(6, '0');
  const token = sessionStorage.getItem('access');
  const [securityGroup, setSecurityGroup] = useState([]);
  const [group, setGroup] = useState([]);
  const [steps, setSteps] = useState([]);
  const [status, setStatus] = useState([]);
  const [statList, setStatList] = useState([]);

  /**
   * Fetch the data of the specified problemId from the database
   */
  function getProblemData() {
    Axios({
      method: 'GET',
      url: `/api/singleProblem/?problemId=${problemId}`,
    })
      .then((response) => {
        const data = response.data;
        setProblemData(data);
        setTickNum(data.ticketNumber);
        //setLoading(false);
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
   *  Fetch all users from the api_user table and store it on userList state
   */
  function getUsers() {
    Axios({
      method: 'GET',
      url: '/api/userFast/',
    })
      .then((response) => {
        const data = response.data;
        setUserList(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  const getStatus = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/problemStatus/`,
      });
      const data = await response.data;
      setStatList(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  function getStatusList() {
    setSteps([]);
    statList.map((e) => {
      setSteps((current) => [...current, e.status_name]);
    });
  }

  /**
   *  Fetch all users with the role technician (1) from the database and store it on technicianList state
   */
  function getTechnicians() {
    Axios({
      method: 'GET',
      url: '/api/getTechnician/?role_id=2',
    })
      .then((response) => {
        const data = response.data;
        setTechnicianList(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function getSecurityGroups() {
    Axios({
      method: 'GET',
      url: `/api/securitygroups/`,
    })
      .then((response) => {
        const data = response.data;
        setGroup(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  const getSLAs = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/sla/`,
      });
      const data = await response.data;
      setSlaData(data.filter((agreement) => agreement.type_id === problemId));
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  useEffect(() => {
    getProblemData();
    getUsers();
    getTechnicians();
    getSLAs();
    getStatus();
    getSecurityGroups();
  }, []);

  useEffect(() => {
    if (
      problemData &&
      userList.length &&
      technicianList.length &&
      group.length
    ) {
      setLoading(false);
    }
  });

  /**
   * Sets the states from the fetched Problem Data (getProblemData)
   */
  function setData() {
    setUser(userList.find((item) => item.id === problemData.userId));
    setReportDateTime(new Date(problemData.reportDateTime));
    setImpact(Number(problemData.impact));
    setUrgency(Number(problemData.urgency));
    setPriority(Number(problemData.priority));
    setIsMultipleAffected(problemData.multipleAffectedUser);
    setTicket({
      ...ticket,
      affectedUserSize: Number(problemData.affectedUserSize),
      summary: String(problemData.summary),
      details: String(problemData.details),
    });
    if (problemData.status > 6) {
      setActiveStatus(Number(problemData.status) - 2);
    } else {
      setActiveStatus(Number(problemData.status) - 1);
    }
    setTechnician(
      technicianList.find((item) => item.id === problemData.assignedTechId)
    );
    setSecurityGroup(problemData.security_group);
  }

  useEffect(() => {}, [isMultipleAffected]);

  useEffect(() => {
    setData();
    getStatusList();
  }, [loading]);

  /**
   * It loops through the userList array to find the username of the ownerId
   * @param ownerId - The ID of the user you want to get the username of.
   * @returns The value of the username.
   */
  function getUsername(ownerId) {
    let value;

    // Loops through the roles to find exact value
    userList.forEach((name) => {
      if (name.id === ownerId) {
        value = name.username;
      }
    });

    return value;
  }

  /**
   * It loops through the technicianList array and returns the first and last name of the technician that
   * matches the userId.
   * @param userId - The id of the user you want to get the full name of.
   * @returns The value of the first_name and last_name of the technician.
   */
  function getTechFullName(userId) {
    let value;

    // Loops through the roles to find exact value
    technicianList.forEach((name) => {
      if (name.id === userId) {
        value = name.first_name + ' ' + name.last_name;
      }
    });

    return value;
  }

  /**
   * It loops through the userList array and returns the first_name and last_name of the user with the
   * matching id.
   * @param userId - The id of the user you want to get the full name of.
   * @returns The value of the user's full name.
   */
  function getUserFullName(userId) {
    let value;

    // Loops through the roles to find exact value
    userList.forEach((name) => {
      if (name.id === userId) {
        value = name.first_name + ' ' + name.last_name;
      }
    });

    return value;
  }

  /**
   * Function to navigate the page back to the all list.
   */
  let navigate = useNavigate();
  const routeChangeBack = () => {
    let path = '/problem/all';
    navigate(path);
  };

  /**
   * Function to navigate the page to edit the problem
   */
  const routeChangeEdit = () => {
    let path = '/problem/edit?problemId=' + problemId;
    navigate(path);
  };

  /**
   * Gets the security value based on the ID.
   * @param {*} sGroupId
   * @returns
   */
  function getSecurityGroup(sGroupId) {
    let value = 'N/A';

    // Loops through the security groups to find exact value
    group.forEach((securityGroup) => {
      if (securityGroup.securityGroupId === sGroupId) {
        value = securityGroup.name;
      }
    });

    return value;
  }

  document.title = 'Problem Ticket #' + ticketNum + ' - PiXELL-River';

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <span>Loading. . .</span>
          <div className="half-spinner"></div>
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <Paper elevation={10}>
              <Box p={4}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="#525252"
                  align="center"
                  pb={5}
                >
                  View Problem Ticket{' '}
                  {slaData.length !== 0
                    ? ' - SLA Status: ' + slaData[0].status
                    : ''}
                </Typography>
                <Box pb={5} sx={{ width: '100%' }}>
                  <Stepper alternativeLabel activeStep={activeStatus}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepButton>
                          <StepLabel>{label}</StepLabel>
                        </StepButton>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                <Box pb={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={1} />

                    <Grid item xs={4}>
                      <TextField
                        id="ticketNumber"
                        label="Ticket Number"
                        variant="filled"
                        name="ticketNumber"
                        margin="normal"
                        type="text"
                        value={String(
                          'PRB' + tickNum.toString().padStart(6, '0')
                        )}
                        inputProps={{ readOnly: true }}
                        fullWidth
                      />

                      <TextField
                        id="user"
                        label="User"
                        variant="filled"
                        name="user"
                        margin="normal"
                        type="text"
                        value={String(getUserFullName(problemData.userId))}
                        inputProps={{ readOnly: true }}
                        fullWidth
                      />

                      <Box pt={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            label="Report Date Time"
                            value={reportDateTime}
                            renderInput={(params) => (
                              <TextField
                                required
                                {...params}
                                sx={{ width: '100%' }}
                              />
                            )}
                            disabled
                          />
                        </LocalizationProvider>
                      </Box>
                      <Box pt={5}>
                        <FormControlLabel
                          control={<Switch color="primary" />}
                          label="Multiple Affected User"
                          labelPlacement="start"
                          checked={isMultipleAffected}
                          name="multipleUserAffected"
                          disabled
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={2} />

                    <Grid item xs={4}>
                      <Typography textAlign="center">Impact</Typography>
                      <Slider
                        size="small"
                        aria-label="Restricted values"
                        valueLabelFormat={valueLabelFormat}
                        getAriaValueText={valuetext}
                        step={null}
                        valueLabelDisplay="auto"
                        marks={marks}
                        min={1}
                        max={4}
                        value={impact}
                        name="impact"
                        disabled
                      />
                      <Typography textAlign="center">Urgency</Typography>
                      <Slider
                        size="small"
                        aria-label="Restricted values"
                        valueLabelFormat={valueLabelFormat}
                        getAriaValueText={valuetext}
                        step={null}
                        valueLabelDisplay="auto"
                        marks={marks}
                        min={1}
                        max={4}
                        value={urgency}
                        name="urgency"
                        disabled
                      />
                      <Typography textAlign="center">Priority</Typography>
                      <Slider
                        size="small"
                        aria-label="Restricted values"
                        valueLabelFormat={valueLabelFormat}
                        getAriaValueText={valuetext}
                        step={null}
                        valueLabelDisplay="auto"
                        marks={marks}
                        min={1}
                        max={4}
                        disabled
                        value={priority}
                      />

                      {isMultipleAffected && (
                        <Box pt={2}>
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="number-user-affected-label">
                              No. of User Affected
                            </InputLabel>
                            <Select
                              name="affectedUserSize"
                              labelId="number-user-affected"
                              id="number-user-affected"
                              label="No. of User Affected"
                              value={ticket.affectedUserSize}
                              disabled
                            >
                              <MenuItem value={0}>
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value={1}>1-50</MenuItem>
                              <MenuItem value={2}>51-100</MenuItem>
                              <MenuItem value={3}>101+</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={1} />
                  </Grid>

                  <br />
                  <Divider />

                  <Box pt={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={1} />

                      <Grid item xs={4}>
                        <TextField
                          id="ticketOpenedBy"
                          label="Ticket Opened By"
                          variant="filled"
                          value={String(getUsername(problemData.ticketOwnerId))}
                          inputProps={{ readOnly: true }}
                          fullWidth
                        />

                        <TextField
                          id="assignedTech"
                          label="Assigned Technician"
                          variant="filled"
                          name="assignedTech"
                          margin="normal"
                          type="text"
                          value={String(
                            getTechFullName(problemData.assignedTechId)
                          )}
                          inputProps={{ readOnly: true }}
                          fullWidth
                        />
                        {currentUserRole == 3 && (
                          <Box pt={5}>
                            <FormControlLabel
                              control={<Switch color="primary" />}
                              label="Viewable to Students?"
                              labelPlacement="start"
                              checked={problemData.isAssigned}
                              name="isAssigned"
                              disabled
                            />
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={2} />

                      <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            label="Ticket Created At"
                            value={new Date(problemData.ticketDateTime)}
                            slotProps={{ textField: { sx: { width: '100%' } } }}
                            disabled
                          />
                        </LocalizationProvider>
                        {currentUserRole !== '4' && (
                          <TextField
                            id="securityGroup"
                            label="Security Group"
                            variant="filled"
                            margin="normal"
                            fullWidth
                            value={getSecurityGroup(securityGroup)}
                            name="securityGroup"
                            inputProps={{ readOnly: true }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={1} />
                    </Grid>
                  </Box>

                  <br />
                  <Divider />

                  <Box pt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={1} />

                      <Grid item xs={10}>
                        <TextField
                          required
                          id="summary"
                          label="Summary"
                          variant="filled"
                          fullWidth
                          value={String(problemData.summary)}
                          name="summary"
                          inputProps={{ readOnly: true }}
                        />
                        <Box pt={3}>
                          <TextField
                            required
                            id="details"
                            label="Details"
                            variant="filled"
                            multiline
                            maxRows={100}
                            fullWidth
                            value={String(problemData.details)}
                            name="details"
                            inputProps={{ readOnly: true }}
                          />
                        </Box>
                        <Box pt={3}>
                          <ViewDependencies
                            problems={problemData}
                            users={userList}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={1} />
                    </Grid>
                  </Box>

                  <Box pt={5} textAlign="center">
                    <Button
                      type="button"
                      variant="contained"
                      onClick={routeChangeEdit}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      style={{ margin: '20px' }}
                      onClick={routeChangeBack}
                    >
                      Back
                    </Button>
                  </Box>

                  {/* <br />
                  <Divider />

                  <ProblemComments /> */}
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={2} />
        </Grid>
      )}
    </div>
  );
}

export default ViewProblem;
