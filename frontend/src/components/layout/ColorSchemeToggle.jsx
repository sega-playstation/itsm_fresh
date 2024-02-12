import { useState, useEffect } from 'react';
import { IconButton, useColorScheme as useJoyColorScheme } from '@mui/joy';
import { useColorScheme as useMaterialColorScheme } from '@mui/material';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function ColorSchemeToggle({ onClick, sx, ...props }) {
  const { mode, setMode: setJoyMode } = useJoyColorScheme();
  const { mode: materialMode, setMode: setMaterialMode } =
    useMaterialColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton
        size="sm"
        variant="outlined"
        color="neutral"
        {...props}
        sx={sx}
        disabled
      />
    );
  }

  return (
    <IconButton
      size="sm"
      variant="outlined"
      color="neutral"
      {...props}
      onClick={(event) => {
        if (mode === 'light') {
          setJoyMode('dark');
          setMaterialMode('dark');
        } else {
          setJoyMode('light');
          setMaterialMode('light');
        }
        onClick?.(event);
      }}
      sx={[
        {
          '& > *:first-of-type': {
            display: mode === 'dark' ? 'none' : 'initial',
          },
          '& > *:last-of-type': {
            display: mode === 'light' ? 'none' : 'initial',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <DarkModeRoundedIcon />
      <LightModeIcon />
    </IconButton>
  );
}
