import ManagerMenu from './ManagerMenu';
import ManagerTable from './ManagerTable';
import Map from './Map';
import StaffManagement from './StaffManagment';
import FeedbackDashboard from './FeedbackDashboard';
import React, { useState, useEffect } from 'react';
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
import MapIcon from '@mui/icons-material/Map';
import HelpIcon from '@mui/icons-material/Help';
import AssistanceManager from './AssistanceManager';

const DashboardManager = () => {
  const token = localStorage.getItem('a4-token');
  const employee_type = localStorage.getItem('a4-type');

  const [showMenu, setShowMenu] = useState(true);
  const [showStaff, setShowStaff] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showOrder, setShowOrders] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAssistance, setShowAssistance] = useState(false);

  // const userName = localStorage.getItem("a4-name");
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('menu');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      if (employee_type === 'kitchen-staff') {
        navigate('/dashboardkitchen');
      } else if (employee_type === 'waiter') {
        navigate('/dashboardwait');
      }
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('a4-token');
    localStorage.removeItem('a4-type');
    localStorage.removeItem('a4-name');
    navigate('/login');
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleMenuClick = () => {
    setActiveButton('menu');
    setShowMenu(true);
    setShowStaff(false);
    setShowFeedback(false);
    setShowOrders(false);
    setShowAssistance(false);
    setShowTable(false);
    setShowMap(false);
  };

  const handleStaffClick = () => {
    setActiveButton('staff');
    setShowMenu(false);
    setShowStaff(true);
    setShowFeedback(false);
    setShowOrders(false);
    setShowAssistance(false);
    setShowTable(false);
    setShowMap(false);
  };

  const handleFeedbackClick = () => {
    setActiveButton('feedback');
    setShowMenu(false);
    setShowStaff(false);
    setShowFeedback(true);
    setShowOrders(false);
    setShowAssistance(false);
    setShowTable(false);
  };

  const handleOrdersClick = () => {
    setActiveButton('orders');
    setShowMenu(false);
    setShowStaff(false);
    setShowFeedback(false);
    setShowOrders(true);
    setShowAssistance(false);
    setShowTable(false);
    setShowMap(false);
  };

  const handleTableClick = () => {
    setActiveButton('table');
    setShowMenu(false);
    setShowStaff(false);
    setShowFeedback(false);
    setShowOrders(false);
    setShowAssistance(false);
    setShowTable(true);
    setShowMap(false);
  };

  const handleMapClick = () => {
    setActiveButton('map');
    setShowMenu(false);
    setShowStaff(false);
    setShowFeedback(false);
    setShowOrders(false);
    setShowAssistance(false);
    setShowTable(false);
    setShowMap(true);
  };

  const handleAssitanceClick = () => {
    setActiveButton('assistance');
    setShowMenu(false);
    setShowStaff(false);
    setShowFeedback(false);
    setShowOrders(false);
    setShowAssistance(true);
    setShowTable(false);
    setShowMap(false);
  };

  return (
    <>
      <div className="manager-dash" style={{ paddingBottom: '10px' }}>
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
                      onClick={handleMenuClick}
                      startIcon={<RestaurantMenuIcon />}
                    >
                      Menu
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color={
                        activeButton === 'orders' ? 'secondary' : 'inherit'
                      }
                      variant={activeButton === 'orders' ? 'contained' : ''}
                      onClick={handleOrdersClick}
                      startIcon={<HistoryIcon />}
                    >
                      Orders
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color={activeButton === 'staff' ? 'secondary' : 'inherit'}
                      variant={activeButton === 'staff' ? 'contained' : ''}
                      onClick={handleStaffClick}
                      startIcon={<PeopleAltIcon />}
                    >
                      Staff Management
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color={activeButton === 'table' ? 'secondary' : 'inherit'}
                      variant={activeButton === 'table' ? 'contained' : ''}
                      onClick={handleTableClick}
                      startIcon={<TableRestaurantIcon />}
                    >
                      Tables
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color={activeButton === 'map' ? 'secondary' : 'inherit'}
                      variant={activeButton === 'map' ? 'contained' : ''}
                      onClick={handleMapClick}
                      startIcon={<MapIcon />}
                    >
                      Table Map
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color={
                        activeButton === 'assistance' ? 'secondary' : 'inherit'
                      }
                      variant={activeButton === 'assistance' ? 'contained' : ''}
                      onClick={handleAssitanceClick}
                      startIcon={<HelpIcon />}
                    >
                      Assistance
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color={
                        activeButton === 'feedback' ? 'secondary' : 'inherit'
                      }
                      variant={activeButton === 'feedback' ? 'contained' : ''}
                      onClick={handleFeedbackClick}
                      startIcon={<FeedbackIcon />}
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

      {showMenu && <ManagerMenu />}

      {showStaff && <StaffManagement />}

      {showFeedback && <FeedbackDashboard />}

      {showOrder && <OrderBacklog />}

      {showTable && <ManagerTable />}

      {showAssistance && <AssistanceManager />}

      {showMap && <Map manage={true} />}
    </>
  );
};

export default DashboardManager;
