import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../WaitStaffFooter';
import ChefHatIcon from '@mui/icons-material/BreakfastDining';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const ResponsiveButton = styled(Button)(({ theme }) => ({
  background: '#f1f1f1',
  width: '560px',
  margin: '20px auto',
  padding: '10px',
  position: 'relative',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
  alignItems: 'center',
  color: 'black',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    margin: '10px auto',
  },
}));

const RecommendationsBox = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {},
  [theme.breakpoints.down('sm')]: {},
}));

const WaitStaffOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/not-served`);
        const json = await response.json();
        if (response.ok) {
          setOrders(json);
        } else {
          setError(json.error);
        }
      } catch (error) {
        setError('An error occurred while fetching tables not served.');
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleNextButtonClick = (tableNo, tableId) => {
    localStorage.setItem('tableNo', tableNo);
    localStorage.setItem('tableId', tableId);
    navigate('/dashboardwait/foodOrder');
  };

  const StatusEnum = {
    PENDING: 'PENDING',
    COOKING: 'COOKING',
    READY: 'READY',
    SERVED: 'SERVED',
    PAID: 'PAID',
  };

  const logout = () => {
    localStorage.removeItem('a4-token');
    localStorage.removeItem('a4-type');
    localStorage.removeItem('a4-name');
    navigate('/Login');
  };

  return (
    <div className="Orders">
      <div className="customer-home-page-wrapper">
        <div
          className="header-title-container"
          style={{ backgroundColor: '#e56b6f' }}
        >
          <div className="dashboard-header-title-padding">Orders</div>
          <span className="waitstaff-button" onClick={logout}>
            <LogoutIcon className="button-icons" />
          </span>
        </div>
        <Footer />

        <div className="customer-home-page-wrapper" style={{ margin: 0 }}>
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="waitstaff-recommendations-box">
              {orders && orders.length > 0 ? (
                orders.map((table) => (
                  <ResponsiveButton
                    key={table._id}
                    className="table-box"
                    onClick={() =>
                      handleNextButtonClick(table.TableNo, table._id)
                    }
                    sx={{
                      background: '#f1f1f1',
                      width: '560px',
                      margin: '20px auto',
                      padding: '10px',
                      position: 'relative',
                      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
                      alignItems: 'center',
                      color: 'black',
                    }}
                  >
                    {table.Status === StatusEnum.READY ? (
                      <div className="w-support-button-red">
                        <ChefHatIcon />
                      </div>
                    ) : table.Status === StatusEnum.COOKING ? (
                      <div className="w-support-button-yellow">
                        <ChefHatIcon />
                      </div>
                    ) : table.Status === StatusEnum.PENDING ? (
                      <div className="w-support-button-grey">
                        <ChefHatIcon />
                      </div>
                    ) : (
                      <div className="w-support-button-grey">
                        <ChefHatIcon />
                      </div>
                    )}
                    <div className="support-content">
                      <h4>Table No: {table.TableNo}</h4>
                      <p>Status: {table.Status}</p>
                      <p>
                        TIME OF ORDER:{' '}
                        {new Date(table.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div
                      className="next-button"
                      onClick={() =>
                        handleNextButtonClick(table.TableNo, table._id)
                      }
                    >
                      <NavigateNextIcon />
                    </div>
                  </ResponsiveButton>
                ))
              ) : (
                <RecommendationsBox>
                  <h4>No tables require serving at the moment :)</h4>
                </RecommendationsBox>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitStaffOrders;
