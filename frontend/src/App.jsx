import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import routes from '@/config/routes';

// MUI
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/joy';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { SnackbarProvider, useSnackbar } from './components/SnackbarContext';
import { useState } from 'react';

const materialTheme = materialExtendTheme();
const router = createBrowserRouter(routes);

function TanQueryProvider({ children }) {
  const snackbar = useSnackbar();
  // Keep the QueryClient referentially stable by using React state
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) =>
            snackbar.dispatch(
              'error',
              query?.meta?.errorMessage ?? error?.message,
            ),
        }),
        mutationCache: new MutationCache({
          onError: (error, query) =>
            snackbar.dispatch(
              'error',
              query?.meta?.errorMessage ?? error?.message,
            ),
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function CoreProviders({ children }) {
  return (
    <HelmetProvider>
      <UserProvider>
        <SnackbarProvider autoHideDuration={4000}>
          <TanQueryProvider>
            <MaterialCssVarsProvider
              theme={{ [MATERIAL_THEME_ID]: materialTheme }}
            >
              <JoyCssVarsProvider>{children}</JoyCssVarsProvider>
            </MaterialCssVarsProvider>
          </TanQueryProvider>
        </SnackbarProvider>
      </UserProvider>
    </HelmetProvider>
  );
}

export default function App() {
  return (
    <CoreProviders>
      <Helmet titleTemplate="%s - PiXELL River" />
      <CssBaseline />
      <RouterProvider router={router} />
      <ReactQueryDevtools position="bottom" />
    </CoreProviders>
  );
}
