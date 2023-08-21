import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  // const userName = localStorage.getItem("a4-name");
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('menu');

  const handleLogout = () => {
    localStorage.removeItem('a4-token');
    localStorage.removeItem('a4-type');
    localStorage.removeItem('a4-name');
    navigate('/login');
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div style={{ paddingBottom: '10px' }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Manager Dashboard
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Button
                    color={activeButton === 'menu' ? 'secondary' : 'inherit'}
                    variant={activeButton === 'menu' ? 'contained' : ''}
                    onClick={() => handleButtonClick('menu')}
                  >
                    Menu
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color={activeButton === 'staff' ? 'secondary' : 'inherit'}
                    variant={activeButton === 'staff' ? 'contained' : ''}
                    onClick={() => handleButtonClick('staff')}
                  >
                    Staff Management
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color={
                      activeButton === 'feedback' ? 'secondary' : 'inherit'
                    }
                    variant={activeButton === 'feedback' ? 'contained' : ''}
                    onClick={() => handleButtonClick('feedback')}
                  >
                    Feedback
                  </Button>
                </Grid>
                <Grid item>
                  <IconButton color="inherit">
                    <AccountCircleIcon />
                    <Typography
                      variant="subtitle1"
                      component="div"
                      paddingLeft={1}
                    >
                      {localStorage.getItem('a4-name')}
                    </Typography>
                  </IconButton>
                </Grid>
                <Grid item>
                  <Button
                    color="error"
                    variant="contained"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
