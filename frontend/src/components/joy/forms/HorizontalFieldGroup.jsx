import { Stack, FormLabel } from '@mui/joy';

export default function HorizontalFieldGroup({ label, children }) {
  return (
    <Stack spacing={1}>
      <FormLabel>{label}</FormLabel>
      <Stack flexDirection={{ sm: 'column', md: 'row' }} spacing={2} useFlexGap>
        {children}
      </Stack>
    </Stack>
  );
}
