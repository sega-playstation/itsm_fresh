import * as React from 'react';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from './AccountMenu';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from '@mui/material/Link';

export default function Navbar({ breadcrumbs }) {
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  function backToDashboard() {
    navigate('/');
  }

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  const test = [
    <Link underline="hover" key="1" color="inherit" href="/">
      MUI
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/">
      Core
    </Link>,
    <Typography key="3" color="text.primary">
      Breadcrumb
    </Typography>,
  ];

  return (
    <>
      <Avatar
        onClick={backToDashboard}
        alt="logo"
        src="/images/logo_small.png"
      />
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        <strong onClick={backToDashboard}>&nbsp;PiXELL-River</strong>
        <br />

        <Stack spacing={2} marginLeft={0.5}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Typography>
      <AccountMenu />
    </>
  );
}
