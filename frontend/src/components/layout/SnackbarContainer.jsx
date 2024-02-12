import { useSnackbar } from '@/components/SnackbarContext';
import { IconButton, Snackbar, Typography as T } from '@mui/joy';

// Icons
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';

const severityProps = {
  error: {
    color: 'danger',
    Icon: ErrorOutlineOutlinedIcon,
  },
  warning: {
    color: 'warning',
    Icon: WarningAmberOutlinedIcon,
  },
  info: {
    color: 'neutral',
    Icon: InfoOutlinedIcon,
  },
  success: {
    color: 'success',
    Icon: CheckCircleOutlinedIcon,
  },
};

const actionButtonProps = {
  size: 'sm',
  sx: { 'color': 'inherit', '--Icon-color': 'inherit' },
};

export default function SnackbarContainer() {
  const { open, severity, message, hide } = useSnackbar();
  const { color, Icon } = severityProps[severity];

  const handleClose = (e, reason) => {
    if (reason === 'clickaway') return;
    hide();
  };

  return (
    <Snackbar
      open={open}
      color={color}
      size="sm"
      variant="solid"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      startDecorator={<Icon />}
      endDecorator={
        <IconButton onClick={hide} {...actionButtonProps}>
          <CloseIcon />
        </IconButton>
      }
      onClose={handleClose}
    >
      <T level="title-md" sx={{ color: 'inherit' }}>
        {message}
      </T>
    </Snackbar>
  );
}
