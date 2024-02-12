import { DataGrid } from '@mui/x-data-grid';
import { unstable_joySlots as joySlots } from '@mui/x-data-grid/joy';
import { styled } from '@mui/joy';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  borderWidth: 0,
  '& .MuiDataGrid-main': {
    boxSizing: 'content-box',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 'var(--unstable_DataGrid-radius)',
    borderColor: 'var(--mui-palette-TableCell-border)',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.vars.palette.background.level1,
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: theme.vars.palette.text.secondary,
    fontFamily: theme.vars.fontFamily.body,
    fontSize: theme.vars.fontSize.sm,
    fontWeight: theme.vars.fontWeight.lg,
  },
  '& .MuiDataGrid-row': {
    backgroundColor: theme.vars.palette.background.surface,
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: theme.vars.palette.background.level1,
  },
  '& .MuiDataGrid-cell:focus': {
    // ITSM specific
    outline: 'none',
  },
  '& .Mui-DataGrid-cell:focus-within': {
    // ITSM specific
    outline: 'none',
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '0',
    backgroundColor: 'transparent',
  },
}));

export default function JoyDataGrid(props) {
  return (
    <StyledDataGrid
      slots={joySlots}
      disableRowSelectionOnClick // move to ITSM-DataGrid
      {...props}
    />
  );
}
