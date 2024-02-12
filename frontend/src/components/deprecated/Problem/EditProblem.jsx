import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import Autocomplete from '@mui/material/Autocomplete';
// import ProblemComments from "./ProblemComments";
import '@/styles/deprecated/preloader3.css';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import IncidentDependencies from './Incident_Dependencies/IncidentDependencies';
import EditDependencies from './Incident_Dependencies/EditDependencies';
import DeleteDependencies from './Incident_Dependencies/DeleteDependencies';

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

const steps = [
  'Open',
  'Pending',
  'Under Investigation',
  'Work Around',
  'Known Error',
  'Resolved ',
  'Closed',
];

/**
 * Default Export function for viewing problem ticket
 * Child components: ProblemComments
 */
function EditProblem() {
  const query = new URLSearchParams(useLocation().search);
  const problemId = query.get('problemId');
  const [loading, setLoading] = useState(true);
  const [problemData, setProblemData] = useState([]);
  const [user, setUser] = useState();
  const [userList, setUserList] = useState([]);
  const [slaData, setSlaData] = useState([]);
  const [isMultipleAffected, setIsMultipleAffected] = useState(false);
  const [impact, setImpact] = useState(4);
  const [urgency, setUrgency] = useState(4);
  const [priority, setPriority] = useState(4);
  const currentDate = new Date();
  const [reportDateTime, setReportDateTime] = useState(new Date());
  const [steps, setSteps] = useState([]);
  const [statList, setStatList] = useState([]);
  const [status, setStatus] = useState([]);
  const currentUserRole = sessionStorage.getItem('roleId');
  const [problemGroup, setProblemGroup] = useState([]);
  const [group, setGroup] = useState();
  const [technician, setTechnician] = useState();
  const [technicianList, setTechnicianList] = useState([]);
  const [activeStatus, setActiveStatus] = React.useState(0);
  const [ticket, setTicket] = useState({
    summary: '',
    details: '',
    affectedUserSize: '',
  });
  const [dependencies, setDependencies] = useState([0]);
  const [newDependencies, setNewDependencies] = useState(false);
  const token = sessionStorage.getItem('access');
  const [isAssigned, setisAssigned] = useState();

  const [ticketNumber, setTicketNumber] = useState([]);
  const ticketNum = 'PRB' + ticketNumber.toString().padStart(6, '0');

  useEffect(() => {
    getProblemData();
    getUsers();
    getTechnicians();
    getGroups();
    getStatus();
    getSLAs();
  }, []);

  // useEffect(() => {
  //   if (problemData && userList.length && technicianList.length) {
  //     setLoading(false);
  //   }
  // });

  useEffect(() => {
    handleChangePriority();
  }, [impact, urgency]);

  useEffect(() => {}, [isMultipleAffected]);

  useEffect(() => {
    setData();
    getStatusList();
  }, [loading]);

  function handleDependenciesChange(dependencies) {
    setDependencies(dependencies);
    setNewDependencies(true);
  }

  function handleGroup(group) {
    setGroup(group);
  }

  /**
   * Fetch the data of the specified problemId from the database
   */
  function getProblemData() {
    Axios({
      method: 'GET',
      url: `/api/editProblem/?problemId=${problemId}`,
    })
      .then((response) => {
        const data = response.data;
        setProblemData(data);
        setDependencies(data.incidents);
        setTicketNumber(data.ticketNumber);
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
   * Fetches the values of the groups from the API.
   */

  const getStatus = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/problemStatus/`,
      });
      const data = await response.data;
      setStatList(
        data.filter(
          (status) =>
            status.status_name !== 'Caution' && status.status_name !== 'Breach'
        )
      );
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

  const getGroups = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/securitygroups/`,
      });
      const data = await response.data;
      setProblemGroup(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  const getUsers = async () => {
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/userFast/`,
      });

      const data = await response.data;
      setUserList(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

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
    setisAssigned(problemData.isAssigned);
    if (problemData.status > 6) {
      setActiveStatus(Number(problemData.status) - 2);
      setStatus(Number(problemData.status));
    } else {
      setActiveStatus(Number(problemData.status) - 1);
      setStatus(Number(problemData.status));
    }
    setTechnician(
      technicianList.find((item) => item.id === problemData.assignedTechId)
    );
  }

  /**
   * PUT the ticket data to the problem table on the database. Updating the fields that are edited
   */
  function putTicket(event) {
    Axios({
      method: 'PUT',
      url: `/api/editProblem/?problemId=${problemId}`,

      data: {
        userId: user.id,
        status: status,
        reportDateTime: reportDateTime.toISOString(),
        multipleAffectedUser: isMultipleAffected,
        affectedUserSize: ticket.affectedUserSize,
        impact: impact,
        urgency: urgency,
        priority: priority,
        ticketOwnerId: problemData.ticketOwnerId,
        ticketDateTime: problemData.ticketDateTime,
        assignedTechId: technician.id,
        summary: ticket.summary,
        details: ticket.details,
        ticketNumber: problemData.ticketNumber,
        security_group: group,
        isAssigned: isAssigned,
      },
    })
      .then((response) => {
        if (slaData.length !== 0 && (status === 7 || status === 8)) {
          editSLA(status);
        } else {
          if (newDependencies == true) {
            postProblemIncident();
          } else {
            window.location.href = '../problem/all';
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    event.preventDefault();
  }

  function editSLA(status) {
    Axios({
      method: 'PATCH',
      url: `/api/slaData/${slaData[0].id}/`,

      data: {
        status: status,
      },
    })
      .then((response) => {
        if (newDependencies == true) {
          postProblemIncident();
        } else {
          window.location.href = '../problem/all';
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function postProblemIncident(event) {
    Axios({
      method: 'PATCH',
      url: `/api/problemsRelated/`,

      data: {
        problemsRelated: problemId,
        dependencies: dependencies,
      },
    })
      .then((response) => {
        window.location.href = '../problem/all';
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
    event.preventDefault();
  }

  /**
   * Handles priority change when Impact/Urgency is adjusted according to the ITIL matrix
   */
  const handleChangePriority = () => {
    if (urgency === 4) {
      setPriority(4);
    } else {
      if (urgency === 3) {
        if (impact !== 1) {
          setPriority(3);
        } else {
          setPriority(2);
        }
      } else {
        if (urgency === 2) {
          if (impact === 1) {
            setPriority(1);
          } else if (impact === 4) {
            setPriority(3);
          } else {
            setPriority(2);
          }
        } else {
          if (urgency === 1) {
            if (impact < 3) {
              setPriority(1);
            } else {
              setPriority(2);
            }
          }
        }
      }
    }
  };

  /**
   * Handle onChange for summary and details field
   */
  function handleChangeField(event) {
    const { name, value } = event.target;
    setTicket((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
  }

  const handleStatusStep = (step) => () => {
    if (step >= 5) {
      setActiveStatus(step);
      setStatus(step + 2);
    } else {
      setStatus(step + 1);
      setActiveStatus(step);
    }
  };

  let navigate = useNavigate();
  const routeChangeBack = () => {
    let path = '/problem/all';
    navigate(path);
  };

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
   * Find the item in the technicianList array that has an id property that matches the userId parameter
   * and return that item.
   * @param userId - The id of the technician you want to get the full name of.
   * @returns The object that matches the userId.
   */
  function getTechFullName(userId) {
    return technicianList.find((item) => item.id === userId);
  }

  /**
   * Find the user in the userList array that has the same id as the userId parameter and return that
   * user.
   * @param userId - The user ID of the user you want to get the full name of.
   * @returns The user object with the matching id.
   */
  function getUserFullName(userId) {
    return userList.find((item) => item.id === userId);
  }

  document.title = 'Edit Problem Ticket #' + ticketNum + ' - PiXELL-River';

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
                  Edit Problem Ticket{' '}
                  {slaData.length !== 0
                    ? ' - SLA Status: ' + slaData[0].status
                    : ''}
                </Typography>
                <Box pb={5} sx={{ width: '100%' }}>
                  <Stepper nonLinear alternativeLabel activeStep={activeStatus}>
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepButton
                          color="inherit"
                          onClick={handleStatusStep(index)}
                        >
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
                        value={ticketNum}
                        disabled
                        fullWidth
                      />
                      <Box pt={2}>
                        <Autocomplete
                          defaultValue={getUserFullName(problemData.userId)}
                          id="grouped-userList"
                          options={userList.sort((a, b) =>
                            a.first_name.localeCompare(b.first_name)
                          )}
                          //groupBy={(option) => option.first_name[0]}
                          getOptionLabel={(option) =>
                            `${option.first_name} ${option.last_name}`
                          }
                          noOptionsText={'No Results Found'}
                          renderOption={(props, option, index) => {
                            const key = `listItem-${index}-${option.id}`;
                            return (
                              <li {...props} key={key}>
                                {option.first_name} {option.last_name}
                              </li>
                            );
                          }} // This renderOption resolves a problem stemming from duplicate names.
                          renderInput={(params) => (
                            <TextField required {...params} label="User" />
                          )}
                          onChange={(event, newValue) => {
                            setUser(newValue);
                          }}
                        />
                      </Box>
                      <Box pt={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            label="Report Date Time"
                            value={reportDateTime}
                            onChange={(newValue) => {
                              setReportDateTime(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                required
                                {...params}
                                sx={{ width: '100%' }}
                              />
                            )}
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
                          onChange={(event) => {
                            setIsMultipleAffected(event.target.checked);
                            setTicket({ ...ticket, affectedUserSize: 0 });
                          }}
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
                        onChange={(event, newValue) => {
                          setImpact(newValue);
                        }}
                        name="impact"
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
                        onChange={(event, newValue) => {
                          setUrgency(newValue);
                        }}
                        name="urgency"
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
                              onChange={handleChangeField}
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
                          value={getUsername(problemData.ticketOwnerId)}
                          disabled
                          fullWidth
                        />
                        <Box pt={2}>
                          <Autocomplete
                            defaultValue={getTechFullName(
                              problemData.assignedTechId
                            )}
                            id="grouped-techncianList"
                            options={technicianList.sort((a, b) =>
                              a.first_name.localeCompare(b.first_name)
                            )}
                            getOptionSelected={(option, value) =>
                              option.value === value.value
                            }
                            //groupBy={(option) => option.first_name[0]}
                            getOptionLabel={(option) =>
                              `${option.first_name} ${option.last_name}`
                            }
                            noOptionsText={'No Results Found'}
                            renderOption={(props, option, index) => {
                              const key = `listItem-${index}-${option.id}`;
                              return (
                                <li {...props} key={key}>
                                  {option.first_name} {option.last_name}
                                </li>
                              );
                            }} // This renderOption resolves a problem stemming from duplicate names.
                            renderInput={(params) => (
                              <TextField
                                required
                                {...params}
                                label="Assigned Technician"
                              />
                            )}
                            // value={technician}
                            onChange={(event, newValue) => {
                              setTechnician(newValue);
                            }}
                          />
                        </Box>
                        {currentUserRole == 3 && (
                          <Box pt={5}>
                            <FormControlLabel
                              control={<Switch color="primary" />}
                              label="Viewable to Students?"
                              labelPlacement="start"
                              checked={isAssigned}
                              name="isAssigned"
                              onChange={(event) => {
                                setisAssigned(event.target.checked);
                              }}
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
                          <Box pt={2}>
                            <Autocomplete
                              defaultValue={problemGroup.find(
                                (item) =>
                                  item.securityGroupId ===
                                  problemData.security_group
                              )}
                              id="securityGroup"
                              disableClearable
                              options={problemGroup}
                              getOptionLabel={(option) => `${option.name}`}
                              noOptionsText={'No Results Found'}
                              renderInput={(params) => (
                                <TextField
                                  name="securityGroup"
                                  required
                                  {...params}
                                  label="Security Groups"
                                />
                              )}
                              onChange={(event, newValue) => {
                                handleGroup(newValue.securityGroupId);
                              }}
                            />
                          </Box>
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
                          defaultValue={String(problemData.summary)}
                          name="summary"
                          onChange={handleChangeField}
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
                            defaultValue={String(problemData.details)}
                            name="details"
                            onChange={handleChangeField}
                          />
                        </Box>
                        <Box pt={3}>
                          <DeleteDependencies
                            problems={problemData}
                            users={userList}
                          />
                        </Box>

                        <Box pt={3}>
                          <EditDependencies
                            onDependenciesChange={handleDependenciesChange}
                            problem={problemData}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={1} />
                    </Grid>
                  </Box>

                  <Box pt={5} textAlign="center">
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={putTicket}
                    >
                      Update
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

export default EditProblem;
