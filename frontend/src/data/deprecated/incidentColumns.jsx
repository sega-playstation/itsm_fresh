import { ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import NoteIcon from '@mui/icons-material/Note';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import moment from 'moment';

let currentSlaData = [];
export const incidentstudentColumns = [
  {
    field: 'ticketNumber',
    hideable: false,
    showable: false,
    headerName: 'Incident Number',
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
    hideable: false,
    showable: false,
    headerName: 'User',
    //width: 140,
    flex: 1,
    //valueGetter: getUsername,
  },
  {
    field: 'status',
    hideable: false,
    showable: false,
    headerName: 'Status',
    //width: 180,
    flex: 0.75,
    //valueGetter: getStatus,
  },
  {
    field: 'priority',
    hideable: false,
    showable: false,
    headerName: 'Priority',
    //width: 130,
    flex: 0.5,
    //valueGetter: getPriority,
  },
  {
    field: 'subject',
    hideable: false,
    showable: false,
    headerName: 'Subject',
    //width: 200
    flex: 1,
  },
  {
    field: 'assignedTechId',
    hideable: false,
    showable: false,
    headerName: 'Assigned Technician',
    //width: 200,
    flex: 1,
    //valueGetter: getAssignedTech,
  },
  {
    field: 'ticketDateTime',
    hideable: false,
    showable: false,
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
    hideable: false,
    showable: false,
    width: 60,
    headerAlign: 'center',
    align: 'center',
    renderCell: (cellValues) => {
      return (
        <Link to={`/incident/view?incidentId=${cellValues.row.id}`}>
          <ListItemButton>
            <VisibilityIcon />
          </ListItemButton>
        </Link>
      );
    },
  },
  {
    field: 'Edit',
    hideable: false,
    showable: false,
    width: 60,
    headerAlign: 'center',
    align: 'center',
    renderCell: (cellValues) => {
      return (
        <Link to={`/incident/edit?incidentId=${cellValues.row.id}`}>
          <ListItemButton>
            <EditIcon />
          </ListItemButton>
        </Link>
      );
    },
  },
];

export const incidentadminColumns = [
  {
    field: 'ticketNumber',
    hideable: false,
    showable: false,
    headerName: 'Incident Number',
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
    hideable: false,
    showable: false,
    headerName: 'Created By',
    //width: 200,
    flex: 1,
    //valueGetter: getCreatedBy,
  },
  {
    field: 'userId',
    hideable: false,
    showable: false,
    headerName: 'User',
    //width: 140,
    flex: 1,
    //valueGetter: getUsername,
  },
  {
    field: 'status',
    hideable: false,
    showable: false,
    headerName: 'Status',
    //width: 180,
    flex: 0.75,
    //valueGetter: getStatus,
  },
  {
    field: 'priority',
    hideable: false,
    showable: false,
    headerName: 'Priority',
    //width: 130,
    flex: 0.5,
    //valueGetter: getPriority,
  },
  {
    field: 'subject',
    hideable: false,
    showable: false,
    headerName: 'Subject',
    //width: 200
    flex: 1,
  },
  {
    field: 'assignedTechId',
    hideable: false,
    showable: false,
    headerName: 'Assigned Technician',
    //width: 200,
    flex: 1,
    //valueGetter: getAssignedTech,
  },
  {
    field: 'reportDateTime',
    hideable: false,
    showable: false,
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
    hideable: false,
    showable: false,
    width: 60,
    headerAlign: 'center',
    align: 'center',
    renderCell: (cellValues) => {
      return (
        <Link to={`/incident/view?incidentId=${cellValues.row.id}`}>
          <ListItemButton>
            <VisibilityIcon />
          </ListItemButton>
        </Link>
      );
    },
  },
  {
    field: 'Edit',
    hideable: false,
    showable: false,
    width: 60,
    headerAlign: 'center',
    align: 'center',
    renderCell: (cellValues) => {
      return (
        <Link to={`/incident/edit?incidentId=${cellValues.row.id}`}>
          <ListItemButton>
            <EditIcon />
          </ListItemButton>
        </Link>
      );
    },
  },
];

export const viewProblemRelatedColumn = [
  {
    field: 'ticketNumber',
    hideable: false,
    showable: false,
    headerName: 'Incident Number',
    //width: 200,
    flex: 1,
    valueGetter: getTicketNumber,
  },
  {
    field: 'ticketOwnerId',
    hideable: false,
    showable: false,
    headerName: 'Created By',
    //width: 200,
    flex: 1,
    //valueGetter: getCreatedBy,
  },
  {
    field: 'userId',
    hideable: false,
    showable: false,
    headerName: 'User',
    //width: 140,
    flex: 1,
    //valueGetter: getUsername,
  },
  {
    field: 'status',
    hideable: false,
    showable: false,
    headerName: 'Status',
    //width: 180,
    flex: 0.75,
    //valueGetter: getStatus,
  },
  {
    field: 'priority',
    hideable: false,
    showable: false,
    headerName: 'Priority',
    //width: 130,
    flex: 0.5,
    //valueGetter: getPriority,
  },
  {
    field: 'subject',
    hideable: false,
    showable: false,
    headerName: 'Subject',
    //width: 200
    flex: 1,
  },
  {
    field: 'assignedTechId',
    hideable: false,
    showable: false,
    headerName: 'Assigned Technician',
    //width: 200,
    flex: 1,
    //valueGetter: getAssignedTech,
  },
  {
    field: 'reportDateTime',
    hideable: false,
    showable: false,
    headerName: 'Report Date Time',
    width: 200,
    //flex: 1,
    valueGetter: getDateFormat,
    renderCell: function getDateFormat(params) {
      return moment(params.row.reportDateTime).format('MMM Do YYYY, h:mm a');
    },
  },
];

function getTicketNumber(params) {
  const ticketSLAs = currentSlaData.filter(
    (agreement) => agreement.type_id === params.row.id,
  );
  if (ticketSLAs.length === 0) {
    return `INC` + String(params.row.ticketNumber).padStart(6, '0');
  } else {
    return (
      <>
        {`INC` + String(params.row.ticketNumber).padStart(6, '0')}
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

function getDateFormat(params) {
  return moment(params.row.reportDateTime); //.format("MMM Do YYYY, h:mm a") This formatting is done in renderCell instead now
}

export function incidentColumns(role, slaData) {
  currentSlaData = slaData;
  if (Number.parseInt(role) === 4) {
    return incidentstudentColumns;
  } else {
    return incidentadminColumns;
  }
}

export default incidentColumns;
