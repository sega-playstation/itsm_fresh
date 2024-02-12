/* eslint-disable no-undef */
import { Sheet } from '@mui/joy';
import { Typography as T } from '@mui/joy';

export default function BuildInfo() {
  return (
    <Sheet
      variant="outlined"
      sx={{
        padding: '2px 4px',
        borderRadius: 'sm',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottom: 0,
      }}
    >
      <T level="body-xs" sx={{ fontFamily: 'monospace' }}>
        Build Info: {__BUILD_DATE__} | {__BRANCH_NAME__} - {__COMMIT_HASH__}{' '}
        {__COMMIT_DATE__}
      </T>
    </Sheet>
  );
}
