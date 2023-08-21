import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../WaitStaffFooter';
import LogoutIcon from '@mui/icons-material/Logout';

import Map from '../Map';

const WaitStaffTable = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('a4-token');
    localStorage.removeItem('a4-type');
    localStorage.removeItem('a4-name');
    navigate('/Login');
  };

  return (
    <>
      <div className="customer-home-page-wrapper">
        <div
          className="header-title-container"
          style={{ backgroundColor: '#e56b6f' }}
        >
          <div className="dashboard-header-title-padding">Tables</div>
          <span className="waitstaff-button" onClick={logout}>
            <LogoutIcon className="button-icons" />
          </span>
        </div>

        <Footer />
        <Map manage={true} />
      </div>
    </>
  );
};

export default WaitStaffTable;
