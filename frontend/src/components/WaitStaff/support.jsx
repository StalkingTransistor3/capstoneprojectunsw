import React, { useEffect, useState } from 'react';
import Footer from '../WaitStaffFooter';
import { useNavigate } from 'react-router';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  [theme.breakpoints.down('md')]: {},
  [theme.breakpoints.down('sm')]: {},
}));

const WaitStaffSupport = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`/api/orders/need-assistance`);
        const json = await response.json();

        if (response.ok) {
          setTables(json);
        } else {
          setError(json.error || 'An error occurred while fetching tables.');
        }
      } catch (error) {
        setError('An error occurred while fetching tables.');
      }
    };
    fetchTables();
    const intervalId = setInterval(fetchTables, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleNextButtonClick = (tableNo, tableId) => {
    localStorage.setItem('tableNo', tableNo);
    localStorage.setItem('tableId', tableId);
    navigate('/dashboardwait/foodSupport');
  };

  const logout = () => {
    localStorage.removeItem('a4-token');
    localStorage.removeItem('a4-type');
    localStorage.removeItem('a4-name');
    navigate('/Login');
  };

  return (
    <div className="Support">
      <div className="customer-home-page-wrapper">
        <div
          className="header-title-container"
          style={{ backgroundColor: '#e56b6f' }}
        >
          <div className="dashboard-header-title-padding">Supports</div>
          <span className="waitstaff-button" onClick={logout}>
            <LogoutIcon className="button-icons" />
          </span>
        </div>{' '}
        <Footer />
        <div className="customer-home-page-wrapper" style={{ margin: 0 }}>
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="waitstaff-recommendations-box">
              {tables && tables.length > 0 ? (
                tables.map((table) => (
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
                    <div className="w-support-button-red">
                      <DirectionsRunIcon />
                    </div>

                    <div className="support-content">
                      <h4>Table No: {table.TableNo}</h4>
                      <p> {table.Assisted ? 'Yes' : 'Assistance Needed'}</p>
                      <p>
                        TIME OF REQUEST:{' '}
                        {new Date(table.updatedAt).toLocaleTimeString()}
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
                  <h4>No tables require support at the moment :)</h4>
                </RecommendationsBox>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitStaffSupport;
