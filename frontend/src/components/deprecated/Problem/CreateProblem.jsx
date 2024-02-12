import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
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
} from "@mui/material";
import { Axios } from '@/utils/Axios';
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import IncidentDependencies from "./Incident_Dependencies/IncidentDependencies";

const marks = [
  {
    value: 1,
    label: "1 - Critical",
  },
  {
    value: 2,
    label: "2 - High",
  },
  {
    value: 3,
    label: "3 - Medium",
  },
  {
    value: 4,
    label: "4 - Low",
  },
];

function valuetext(value) {
  return `${value}`;
}

function valueLabelFormat(value) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

/**
 * Default Export function for creating Inident ticket
 */
function CreateProblem() {
  const [maxid, setMaxid] = useState([{ problemId: "placeholder" }]);
  const [id, setId] = useState();
  const [user, setUser] = useState();
  const [userList, setUserList] = useState([]);
  const [isMultipleAffected, setIsMultipleAffected] = useState(false);
  const [impact, setImpact] = useState(4);
  const [urgency, setUrgency] = useState(4);
  const [priority, setPriority] = useState(4);
  const currentDate = new Date();
  const [reportDateTime, setReportDateTime] = useState(new Date());
  const [ticketOwner, setTicketOwner] = useState();
  const [technician, setTechnician] = useState();
  const [technicianList, setTechnicianList] = useState([]);
  const [ticket, setTicket] = useState({
    summary: "",
    details: "",
    affectedUserSize: 0,
  });
  const [tickNum, setTicketNum] = useState();
  const [dependencies, setDependencies] = useState([0]);
  const [isAssigned, setisAssigned] = useState(false);
  let token = sessionStorage.getItem("access");
  let loginUser = sessionStorage.getItem("username");
  let loginUserSection = sessionStorage.getItem("section");
  if (loginUserSection == "null") {
    loginUserSection = null;
  }
  if (loginUserSection == "None") {
    loginUserSection = null;
  }
  const [status, setStatus] = useState([]);
  const [steps, setSteps] = useState([]);
  let problemId;
  const [secGroup, setSecGroup] = useState();
  const [group, setGroup] = useState();
  const currentUserRole = sessionStorage.getItem("roleId");

  useEffect(() => {
    getMaxid();
    getUsers();
    getTechnicians();
    getGroups();
    getStatus();
  }, []);

  useEffect(() => {
    getStatusList();
  }, [status]);

  useEffect(() => {
    handleChangePriority();
  }, [impact, urgency]);

  useEffect(() => {}, [isMultipleAffected]);

  function handleDependenciesChange(dependencies) {
    setDependencies(dependencies);
  }

  /**
   * POST the ticket data to the problem table on the database
   */
  function postTicket(event) {
    Axios({
      method: "POST",
      url: "/api/problemData/",

      data: {
        userId: user,
        status: 1,
        reportDateTime: reportDateTime.toISOString(),
        multipleAffectedUser: isMultipleAffected,
        affectedUserSize: ticket.affectedUserSize,
        impact: impact,
        urgency: urgency,
        priority: priority,
        ticketOwnerId: ticketOwner,
        assignedTechId: technician,
        summary: ticket.summary,
        details: ticket.details,
        ticketOwnerSection: loginUserSection,
        security_group: secGroup,
        isAssigned: isAssigned,
      },
    })
      .then((response) => {
        if (dependencies[0] !== 0) {
          problemId = response.data.id;
          postProblemIncident();
        } else {
          window.location.href = "../problem/all";
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
    event.preventDefault();
  }

  /**
   * Inserts id into array to create the relation between incident and problem ticket.
   * .concat makes it so that it does not override the previous data in the array.
   * @param {*} event
   */
  function postProblemIncident(event) {
    Axios({
      method: "PATCH",
      url: `/api/problemsRelated/`,

      data: {
        problemsRelated: problemId,
        dependencies: dependencies,
      },
    })
      .then((response) => {
        window.location.href = "../problem/all";
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
    event.preventDefault();
  }

  /**
   *  Fetch all users from the api_user table and store it on userList state
   */
  function getUsers() {
    Axios({
      method: "GET",
      url: "/api/userFast/",

    })
      .then((response) => {
        const data = response.data;
        setUserList(data);
        setTicketOwner(
          data.find((element) => element.username === loginUser).id
        );
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
        method: "GET",
        url: `/api/problemStatus/`,

      });
      const data = await response.data;
      setStatus(data);
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
    status.map((e) => {
      setSteps((current) => [...current, e.status_name]);
    });
  }

  /**
   * Fetch the groups from the security group table
   */
  const getGroups = async () => {
    try {
      const response = await Axios({
        method: "GET",
        url: `/api/securitygroups/`,

      });
      const data = await response.data;
      setGroup(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  /**
   * Fetch maxId from the problem table
   */
  function getMaxid() {
    Axios({
      method: "GET",
      url: "/api/problem/",

    })
      .then((response) => {
        const data = response.data;

        let maxTicket = data.length;
        let maxId = maxTicket + 1;
        setTicketNum(maxId);
        maxId = maxId.toString().padStart(6, "0");
        setMaxid("PRB" + maxId);
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
   *  Fetch all users with the role technician (1) from the database and store it on technicianList state
   */
  function getTechnicians() {
    Axios({
      method: "GET",
      url: "/api/getTechnician/?role_id=2",

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
   * Handles change event  when problem ticket field are change
   */
  function handleChangeField(event) {
    const { name, value } = event.target;
    setTicket((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
  }

  const handleGroup = (event) => {
    setSecGroup(event.target.value);
    console.log(dependencies[0].relatedItems_id);
  };

  document.title = "New Problem Ticket " + "- PiXELL-River";

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Paper elevation={10}>
            <form onSubmit={postTicket}>
              <Box p={4}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="#525252"
                  align="center"
                  pb={5}
                >
                  New Problem
                </Typography>
                <Box pb={5} sx={{ width: "100%" }}>
                  <Stepper activeStep={0} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
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
                        value={maxid}
                        disabled
                        fullWidth
                      />
                      <Box pt={2}>
                        <Autocomplete
                          id="grouped-userList"
                          options={userList.sort((a, b) =>
                            a.first_name.localeCompare(b.first_name)
                          )}
                          //groupBy={(option) => option.first_name[0]}
                          getOptionLabel={(option) =>
                            `${option.first_name} ${option.last_name}`
                          }
                          noOptionsText={"No Results Found"}
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
                            setUser(newValue.id);
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
                                sx={{ width: "100%" }}
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
                        defaultValue={4}
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
                        defaultValue={4}
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
                        defaultValue={4}
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
                          <FormControl sx={{ width: "100%" }}>
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
                          value={loginUser}
                          disabled
                          fullWidth
                        />
                        <Box pt={2}>
                          <Autocomplete
                            id="grouped-techncianList"
                            options={technicianList.sort((a, b) =>
                              a.first_name.localeCompare(b.first_name)
                            )}
                            //groupBy={(option) => option.first_name[0]}
                            getOptionLabel={(option) =>
                              `${option.first_name} ${option.last_name}`
                            }
                            getOptionSelected={(option, value) =>
                              option.value === value.value
                            }
                            noOptionsText={"No Results Found"}
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
                            onChange={(event, newValue) => {
                              setTechnician(newValue.id);
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
                            value={currentDate}
                            slotProps={{ textField: { sx: { width: "100%" } }}}
                            disabled
                          />
                        </LocalizationProvider>
                        {currentUserRole !== "4" && (
                          <Box pt={2}>
                            <FormControl fullWidth>
                              <InputLabel>Security Group</InputLabel>
                              <Select
                                name="security_group"
                                label="SecurityGroup"
                                onChange={handleGroup}
                                id="demo-simple_select-helper"
                                labelId="demo-simple-select-helper-label"
                              >
                                {group &&
                                  group.map((security_group) => (
                                    <MenuItem
                                      value={security_group.securityGroupId}
                                    >
                                      {security_group.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
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
                            name="details"
                            onChange={handleChangeField}
                          />
                        </Box>

                        <Box pt={3}>
                          <IncidentDependencies
                            onDependenciesChange={handleDependenciesChange}
                            problem={null}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={1} />
                    </Grid>
                  </Box>
                  <Box pt={5} textAlign="center">
                    <Button type="submit" variant="contained">
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </div>
  );
}

export default CreateProblem;
