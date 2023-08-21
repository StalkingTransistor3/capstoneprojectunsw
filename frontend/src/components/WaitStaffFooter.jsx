import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import GridViewIcon from '@mui/icons-material/GridView';
import TableBarIcon from '@mui/icons-material/TableBar';
import BackHandIcon from '@mui/icons-material/BackHand';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import PaymentIcon from '@mui/icons-material/Payment';
import { styled } from '@mui/system';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case '/dashboardwait':
        setValue(0);
        break;
      case '/dashboardwait/pendingPayments':
        setValue(1);
        break;
      case '/dashboardwait/table':
        setValue(2);
        break;
      case '/dashboardwait/support':
        setValue(3);
        break;
      case '/dashboardwait/orders':
        setValue(4);
        break;
      default:
        break;
    }
  }, [location]);

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/dashboardwait');
        break;
      case 1:
        navigate('/dashboardwait/pendingPayments');
        break;
      case 2:
        navigate('/dashboardwait/table');
        break;
      case 3:
        navigate('/dashboardwait/support');
        break;
      case 4:
        navigate('/dashboardwait/orders');
        break;
      default:
        break;
    }
    setValue(newValue);
  };

  const FooterContainer = styled('div')({
    marginLeft: 'auto',
    marginRight: 'auto',
    borderTop: '1px solid #000',
    paddingTop: '10px',
  });

  return (
    <div className="customer-home-page-wrapper">
      <div className="wait-footer-wrapper">
        <div className="wait-footer-container">
          <FooterContainer>
            <BottomNavigation showLabels value={value} onChange={handleChange}>
              <BottomNavigationAction
                label="Active Orders"
                icon={<GridViewIcon />}
              />
              <BottomNavigationAction
                label="Pending Payments"
                icon={<PaymentIcon />}
              />
              <BottomNavigationAction label="Tables" icon={<TableBarIcon />} />
              <BottomNavigationAction
                label="Supports"
                icon={<BackHandIcon />}
              />
              <BottomNavigationAction
                label="Orders"
                icon={<LocalDiningIcon />}
              />
            </BottomNavigation>
          </FooterContainer>
        </div>
      </div>
    </div>
  );
}
