import { Outlet } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import { useContext } from 'react';
import UserContext from '@/components/UserContext';
import SnackbarContainer from '@/components/layout/SnackbarContainer';
import { Stack } from '@mui/joy';
import BuildInfo from '@/components/layout/BuildInfo';

export default function Layout() {
  const context = useContext(UserContext);

  return (
    <Stack
      flexDirection="row"
      sx={[
        {
          minHeight: '100dvh',
        },
      ]}
    >
      <SnackbarContainer />
      {context.user && (
        <Stack
          component="nav"
          sx={[
            {
              p: 2,
              bgcolor: 'background.surface',
              borderRight: '1px solid',
              borderColor: 'divider',
              width: '270px',
              height: '100dvh',
            },
          ]}
        >
          <Navigation />
        </Stack>
      )}
      <Stack
        flexDirection="column"
        justifyContent="space-between"
        alignItems="flex-start"
        flex={1}
        sx={{ padding: '0 48px', height: '100dvh', overflow: 'auto' }}
      >
        <Stack
          component="main"
          flexDirection="column"
          sx={[
            {
              padding: '24px 0 0',
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            },
          ]}
        >
          <Outlet />
        </Stack>
        {context.user && (
          <footer>
            <BuildInfo />
          </footer>
        )}
      </Stack>
    </Stack>
  );
}
