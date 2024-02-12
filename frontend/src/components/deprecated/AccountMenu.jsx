import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';
import classes from '@/styles/deprecated/Sidebar.module.css';

// Icons
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HomeIcon from '@mui/icons-material/Home';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

//Redirect
import { useNavigate } from 'react-router-dom';

function AccountMenu() {
  const currentUserId = sessionStorage.getItem('userId');
  const currentUserRoleId = sessionStorage.getItem('roleId');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let navigate = useNavigate();
  const [loginUser, setLoginUser] = useState('Not Authorized');

  // Authentication
  function Authentication() {
    if (sessionStorage.getItem('username') != null) {
      setLoginUser(
        sessionStorage.getItem('username').charAt(0).toUpperCase() +
          sessionStorage.getItem('username').slice(1)
      );
    } else {
      setLoginUser('Not Authorized');
      //Navigate to Login Page
      navigate('/login');
    }
  }
  function Logout() {
    sessionStorage.setItem('loggingOut', 'true');
    sessionStorage.clear();
    handleClose();
    //Navigate to Logoff success page
    navigate('/logoff.success');
  }

  useEffect(() => {
    Authentication();
  }, []);

  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Typography>{loginUser}</Typography>
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <Link to="/dash" className={classes.link}>
          <MenuItem onClick={handleClose}>
            <HomeIcon />
            Home
          </MenuItem>
        </Link>

        <Link
          to={`/users/edit?userId=${currentUserId}`}
          className={classes.link}
        >
          <MenuItem onClick={handleClose}>
            <ManageAccountsIcon />
            Edit Account
          </MenuItem>
        </Link>

        {currentUserRoleId === '3' && (
          <Link to={`/users/change-section`} className={classes.link}>
            <MenuItem onClick={handleClose}>
              <DoubleArrowIcon />
              Change Section
            </MenuItem>
          </Link>
        )}

        <MenuItem onClick={Logout}>
          <LogoutIcon />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default AccountMenu;
