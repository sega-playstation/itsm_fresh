import { Modal, styled } from '@mui/joy';

const StyledModal = styled(Modal)(({ theme }) => ({
  '& .MuiModal-backdrop': {
    backdropFilter: 'none',
    backgroundColor: 'rgba(50, 56, 62, 0.5)',
  },
  '& .MuiDialogContent-root': {
    margin: '-0.5rem -1rem -0.5rem -1rem',
    padding: '0.5rem 1rem 0.5rem 1rem',
    overflowY: 'auto',
    backgroundColor: theme.vars.palette.background.body,
  },
  '& .MuiDialogActions-root': {
    padding: 'calc(0.5 * var(--Card-padding)) 0 0 0',
  },
}));

export default function ScrollableModal(props) {
  return <StyledModal {...props} />;
}
