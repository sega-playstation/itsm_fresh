import { ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import NoteIcon from '@mui/icons-material/Note';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import moment from 'moment';

let currentSlaData = [];
export const problemstudentColumns = [
  {
    field: 'ticketNumber',
    hideable: false,
    showable: false,
    headerName: 'Problem Number',
    //width: 200,
    flex: 1,
    renderCell: (cellValues) => {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {getTicketNumber(cellValues)}
        </div>
      );
    },
  },
  {
    field: 'userId',
    headerName: 'User',
    //width: 200,
    flex: 1,
    //valueGetter: getUsername,
  },
  {
    field: 'status',
    headerName: 'Status',
    //width: 200,
    flex: 0.5,
    //valueGetter: getStatus,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    //width: 150,
    flex: 0.5,
    //valueGetter: getPriority,
  },
  { field: 'summary', headerName: 'Summary', width: 200 },
  {
    field: 'assignedTechId',
    headerName: 'Assigned Technician',
    //width: 200,
    flex: 1,
    //valueGetter: getAssignedTech,
  },
  {
    field: 'ticketDateTime',
    headerName: 'Ticket Creation Time',
    width: 200,
    //flex: 1,
    valueGetter: getDateFormat,
    renderCell: function getDateFormat(params) {
      return moment(params.row.reportDateTime).format('MMM Do YYYY, h:mm a');
    },
  },
  {
    field: 'View',
    width: 60,
    headerAlign: 'center',
    align: 'center',
    renderCell: (cellValues) => {
      return (
        <Link to={`/problem/view?problemId=${cellValues.row.id}`}>
          <ListItemButton>
            <VisibilityIcon />
          </ListItemButton>
        </Link>
      );
    },
  },
  {
    field: 'Edit',
    width: 60,
    headerAlign: 'center',
    align: 'center',
    renderCell: (cellValues) => {
      return (
        <Link to={`/problem/edit?problemId=${cellValues.row.id}`}>
          <ListItemButton>
            <EditIcon />
          </ListItemButton>
        </Link>
      );
    },
  },
];

export const problemadminColumns = [
  {
    field: 'ticketNumber',
    hideable: false,
    showable: false,
    headerName: 'Problem Number',
    //width: 200,
    flex: 1,
    renderCell: (cellValues) => {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {getTicketNumber(cellValues)}
        </div>
      );
    },
  },
  {
    field: 'ticketOwnerId',
    headerName: 'Created By',
    //width: 200,
    flex: 1,
    //valueGetter: getCreatedBy,
  },
  {
    field: 'userId',
    headerName: 'User',
    //width: 200,
    flex: 1,
    //valueGetter: getUsername,
  },
  {
    field: 'status',
    headerName: 'Status',
    //width: 200,
    flex: 0.5,
    //valueGetter: getStatus,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    //width: 150,
    flex: 0.5,
    //valueGetter: getPriority,
  },
  { field: 'summary', headerName: 'Summary', width: 200 },
  {
    field: 'assignedTechId',
    headerName: 'Assigned Technician',
    //width: 200,
    flex: 1,
    //valueGetter: getAssignedTech,
  },
  {
    field: 'reportDateTime',
    headerName: 'Report Date Time',
    width: 200,
    //flex: 1,
    valueGetter: getDateFormat,
    renderCell: function getDateFormat(params) {
      return moment(params.row.reportDateTime).format('MMM Do YYYY, h:mm a');
    },
  },
  {
    field: 'View',
    width: 60,
    headerAlign: 'center',
    align: 'center',
    renderCell: (cellValues) => {
      return (
        <Link to={`/problem/view?problemId=${cellValues.row.id}`}>
          <ListItemButton>
            <VisibilityIcon />
          </ListItemButton>
        </Link>
      );
    },
  },
  {
    field: 'Edit',
    width: 60,
    headerAlign: 'center',
    align: 'center',
    renderCell: (cellValues) => {
      return (
        <Link to={`/problem/edit?problemId=${cellValues.row.id}`}>
          <ListItemButton>
            <EditIcon />
          </ListItemButton>
        </Link>
      );
    },
  },
];

export function getTicketNumber(params) {
  const ticketSLAs = currentSlaData.filter(
    (agreement) => agreement.type_id === params.row.id,
  );
  if (ticketSLAs.length === 0) {
    return `PRB` + String(params.row.ticketNumber).padStart(6, '0');
  } else {
    return (
      <>
        {`PRB` + String(params.row.ticketNumber).padStart(6, '0')}
        {ticketSLAs[0].status === 'Breach' ? (
          <PriorityHighIcon color="error" />
        ) : ticketSLAs[0].status === 'Caution' ? (
          <WarningIcon color="warning" />
        ) : (
          <NoteIcon color="primary" />
        )}
      </>
    );
  }
}

export function getDateFormat(params) {
  return moment(params.row.reportDateTime); //.format("MMM Do YYYY, h:mm a") This formatting is done in renderCell instead now
}

export function problemColumns(role, slaData) {
  currentSlaData = slaData;
  if (Number.parseInt(role) === 4) {
    return problemstudentColumns;
  } else {
    return problemadminColumns;
  }
}

export default problemColumns;
