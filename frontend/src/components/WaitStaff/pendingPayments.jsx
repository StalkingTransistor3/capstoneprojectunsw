import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../WaitStaffFooter';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const SpanPlaceholder = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  marginLeft: '10px',
});

const SupportContent = styled('div')({
  textAlign: 'center',
  width: '100%',
});

const ResponsiveButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#f1f1f1',
  width: '560px',
  margin: '20px auto',
  padding: '10px',
  position: 'relative',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
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

const WaitStaffPendingPayments = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`/api/orders/pending-payments`);
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
    navigate('/dashboardwait/foodPayments');
  };

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
          <div className="dashboard-header-title-padding">Payments</div>
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
              {tables && tables.length > 0 ? (
                tables.map((table) => {
                  return (
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
                      <SpanPlaceholder />

                      <SupportContent>
                        <h4>Table No: {table.TableNo}</h4>
                        <p>Active Orders: {table.orders.length}</p>{' '}
                      </SupportContent>

                      <div
                        className="next-button"
                        onClick={() =>
                          handleNextButtonClick(table.TableNo, table._id)
                        }
                      >
                        <NavigateNextIcon />
                      </div>
                    </ResponsiveButton>
                  );
                })
              ) : (
                <RecommendationsBox>
                  <h4>No tables require payment at the moment :)</h4>
                </RecommendationsBox>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WaitStaffPendingPayments;
