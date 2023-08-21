import ManagerMenu from './ManagerMenu';
import StaffManagement from './StaffManagment';
import FeedbackDashboard from './FeedbackDashboard';
import React, { useEffect, useState } from 'react';
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
import FeedbackIcon from '@mui/icons-material/Feedback';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HistoryIcon from '@mui/icons-material/History';
import OrderBacklog from './OrderBacklog';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import HelpIcon from '@mui/icons-material/Help';
import OrderCard from './OrderCard';
import Clock from './Clock';

const DashboardKitchen = () => {
  const token = localStorage.getItem('a4-token');
  const employee_type = localStorage.getItem('a4-type');

  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('menu');
  const [triggerRender, setTriggerRender] = useState(false);

  const [orderData, setOrderData] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('a4-token');
    localStorage.removeItem('a4-type');
    localStorage.removeItem('a4-name');
    navigate('/login');
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleRender = () => {
    setTriggerRender(!triggerRender);
  };

  const refreshOrders = async () => {
    const response = await fetch(`/api/orders/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('a4-token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((respo) => {
        setOrderData(
          respo
            .slice()
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      if (employee_type === 'waiter') {
        navigate('/dashboardwait');
      } else if (employee_type === 'manager') {
        navigate('/dashboardmanager');
      }
    }
  }, []);

  useEffect(() => {
    refreshOrders();
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [triggerRender]);

  return (
    <>
      <div style={{ paddingBottom: '10px' }}>
        <AppBar position="static" style={{ backgroundColor: '#e56b6f' }}>
          <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexGrow: 1,
                      }}
                    >
                      <StorefrontIcon sx={{ marginRight: '8px' }} />
                      Kitchen Dashboard
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
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

      <div>
        <Clock />
      </div>
      <div
        className="card-container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexGrow: '2',
          alignContent: 'space-around',
          gap: '30px',
        }}
      >
        {orderData.map((order) => {
          if (order.Status === 'COOKING' || order.Status === 'PENDING') {
            return <OrderCard {...order} setRender={handleRender} />;
          }

          return null;
        })}
      </div>
    </>
  );
};

export default DashboardKitchen;
