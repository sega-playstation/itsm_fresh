import React, { useEffect, useState } from "react";
import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Collapse,
  Grid,
} from "@mui/material";
import moment from "moment";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { Axios } from '@/utils/Axios';

/**
 * Dependencies dropdown form component for checking the incident dependencies
 * Parent component: CreateProblem
 */
function IncidentDependencies(props) {
  const [open, setOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem("access");
  const [selectedId, setSelectedId] = useState();
  let currentUserId = sessionStorage.getItem("userId");
  let currentUserRole = sessionStorage.getItem("roleId");
  let currentUserSection = sessionStorage.getItem("section");
  const [counter, setCounter] = useState(3);
  const [incidentArray, setIncidentArray] = useState([]);

  useEffect(() => {
    getIncidents();
    getUsers();
  }, []);

  useEffect(() => {
    if (incidents.length) {
      setLoading(false);
    }
  });

  const handleCollapse = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter, open]);

  /**
   * Fetch all the user and store in an array state called Users
   */
  function getUsers() {
    Axios({
      method: "GET",
      url: `/api/userFast/?is_active=true`,

    })
      .then((response) => {
        const data = response.data;
        setUsers(data);
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
   *  Fetch all incidents from the database and store it on incidents state
   */
  function getIncidents() {
    Axios({
      method: "GET",
      url: "/api/problemsRelated/",

    })
      .then((response) => {
        const data = response.data;
        setIncidents(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }
  // **************Value Getter ******************

  function getTicketNumber(params) {
    return `INC` + String(params.row.ticketNumber).padStart(6, "0");
  }

  /*function getDateFormat(params) {
    return moment(params.row.reportDateTime).format("MMM Do YYYY, h:mm a");
  }*/

  const columns = [
    {
      field: "incidentId",
      hideable: false,
      showable: false,
      headerName: "Incident Number",
      width: 150,
      style: { overflow: "wrap" },
      valueGetter: getTicketNumber,
    },
    {
      field: "userId",
      hideable: false,
      showable: false,
      headerName: "User",
      width: 100,
      //valueGetter: getUsername,
    },
    {
      field: "status",
      hideable: false,
      showable: false,
      headerName: "Status",
      width: 150,
      //valueGetter: getStatus,
    },
    {
      field: "priority",
      hideable: false,
      showable: false,
      headerName: "Priority",
      width: 100,
      //valueGetter: getPriority,
    },
    {
      field: "subject",
      hideable: false,
      showable: false,
      headerName: "Subject",
      width: 200
    },
    {
      field: "assignedTechId",
      hideable: false,
      showable: false,
      headerName: "Assigned Technician",
      width: 200,
      //valueGetter: getAssignedTech,
    },
    {
      field: "reportDateTime",
      hideable: false,
      showable: false,
      headerName: "Report Date Time",
      width: 250,
      //valueGetter: getDateFormat //Deprecated for rendercell formatting instead \/
      renderCell: function getDateFormat(params) {
        return moment(params.row.reportDateTime).format("MMM Do YYYY, h:mm a");
      }
    },
  ];

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 1200,
        color: "black",
        bgcolor: "lightgray",
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
            color: "black",
            bgcolor: "#ffebee",
            border: 0,
            borderColor: "primary.main",
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
            <Grid container spacing={2}>
              <Grid item xs={1} />
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={incidents}
                  getRowId={(incidents) => incidents.id}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                  disableColumnSelector
                  selectionModel={selectedId}
                  onSelectionModelChange={(id) => {
                    const selectedIDs = new Set(id);
                    setSelectedId(id);
                    props.onDependenciesChange(id);
                  }}
                  getCellClassName={(params) => {
                    if (params.field === "priority") {
                      switch (params.row.priority) {
                        case 1:
                          return "Critical";
                        case 2:
                          return "High";
                        case 3:
                          return "Medium";
                        case 4:
                          return "Low";

                        default:
                          return null;
                      }
                    }
                  }}
                  initialState={{
                    sorting: {
                      sortModel: [
                        {
                          field: "incidentId",
                          sort: "desc",
                        },
                      ],
                    },
                  }}
                />
              </div>
              <Grid item xs={1} />
            </Grid>
          )}
        </Box>
      </Collapse>
    </List>
  );
}

export default IncidentDependencies;
