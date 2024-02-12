import { Stack, Typography } from '@mui/joy';

export default function LabelText({ label, children }) {
  return (
    <Stack>
      <Typography component="div" level="title-sm">
        {label}
      </Typography>
      <Typography component="div" level="body-sm">
        {children}
      </Typography>
    </Stack>
  );
}
