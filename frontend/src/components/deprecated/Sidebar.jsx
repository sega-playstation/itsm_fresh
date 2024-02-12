import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import classes from './Sidebar.module.css';
import Link from '@mui/material/Link';

/* 
Deprecated Sidebar, Reference Only!!! 
Use Sidebar2 for future development!!!
*/

function Sidebar() {
  const [incident, setIncident] = React.useState(true);
  const [problem, setProblem] = React.useState(true);

  const incidentListItems = [
    { title: 'New Incident Ticket', url: '../incident/new' },
    { title: 'All Incident Ticket', url: '../incident/all' },
    { title: 'Open Incident Ticket', url: '../incident/open' },
    { title: 'Open Incident Ticket (Me)', url: '../incident/me' },
    { title: 'Resolved Incident Ticket', url: '../incident/resolved' },
  ];

  const userListItems = [
    { title: 'Add New User', url: '../users/new' },
    { title: 'All Users', url: '../users/all' },
  ];

  const handleIncident = () => {
    setIncident(!incident);
  };

  const handleProblem = () => {
    setProblem(!problem);
  };

  return (
    <List sx={{ width: '100%' }} component="nav" className={classes.List}>
      <ListSubheader component="div" sx={{ width: '100%' }}>
        Incident Management
      </ListSubheader>
      <ListItemButton onClick={handleIncident}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Incident" />
        {incident ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={incident} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {incidentListItems.map((incidentListItem) => (
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <Link href={incidentListItem.url} underline="none">
                <ListItemText primary={incidentListItem.title} />
              </Link>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
      <ListSubheader component="div" sx={{ width: '100%' }}>
        Change Management
      </ListSubheader>
      <ListSubheader component="div" sx={{ width: '100%' }}>
        User Management
      </ListSubheader>

      <ListItemButton onClick={handleProblem}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="User" />
        {problem ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={problem} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {userListItems.map((userListItem) => (
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <Link href={userListItem.url} underline="none">
                <ListItemText primary={userListItem.title} />
              </Link>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
      <ListSubheader component="div" sx={{ width: '100%' }}>
        Identity and Access Management
      </ListSubheader>
      <ListSubheader component="div" sx={{ width: '100%' }}>
        Asset Management
      </ListSubheader>
    </List>
  );
}

export default Sidebar;
