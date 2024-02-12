import { Box, CircularProgress } from '@mui/joy';

export default function LoadingSpinner({ size = 'md' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '25px',
        height: '100%',
      }}
    >
      <CircularProgress variant="plain" size={size} />
    </Box>
  );
}
