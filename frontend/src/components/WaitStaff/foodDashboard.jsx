import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from '@mui/material/Button';

const WaitStaffFoodDashboard = () => {
  const { tableNo } = useParams();
  const storedTableId = localStorage.getItem('tableId');
  const storedTableNo = localStorage.getItem('tableNo');
  const navigate = useNavigate();

  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch(`/api/orders/${storedTableId}`);

        if (response.ok) {
          const data = await response.json();
          setTableData(data);
        } else {
          setError('An error #1 occurred while fetching table data.');
        }
      } catch (error) {
        setError('An error #2 occurred while fetching table data.');
      }
    };

    fetchTableData();
    const intervalId = setInterval(fetchTableData, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [storedTableNo]);

  const handleBack = () => {
    navigate('/dashboardwait/');
  };

  const handleUpdateServed = async () => {
    try {
      const response = await fetch(
        `/api/orders/readyToServed/${storedTableId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setTableData({ ...tableData, Served: true });
        navigate('/dashboardwait/');
      } else {
        setError('An error #1 occurred while updating table data.');
      }
    } catch (error) {
      setError('An error #2 occurred while updating table data.');
    }
  };

  const handleUpdateAssistance = async () => {
    try {
      const response = await fetch(
        `/api/orders/updateNeedAssistanceToFalse/${storedTableNo}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setTableData({ ...tableData, NeedAssistance: false });
        navigate('/dashboardwait/');
      } else {
        setError('An error #1 occurred while updating table data.');
      }
    } catch (error) {
      setError('An error #2 occurred while updating table data.');
    }
  };

  return (
    <div className="customer-home-page-wrapper">
      <div
        className="header-title-container"
        style={{ backgroundColor: '#e56b6f' }}
      >
        <span className="waitstaff-button" onClick={handleBack}>
          <ArrowBackIosIcon className="button-icons" />
        </span>

        <div className="dashboard-header-title-padding-right">
          Table {storedTableNo || tableNo}
        </div>
      </div>

      {tableData && (
        <div>
          <div
            className="customer-your-orders-container"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            {tableData.FoodItems.map((item, index) => (
              <div key={index} className="waitstaff-supportorder-item">
                <div className="quantity-box">
                  <p>{item.foodQuantity}</p>
                </div>
                <div className="item-details">
                  <p>
                    <strong>{item.foodName}</strong>
                  </p>
                  {item.foodOptions.length > 0 && (
                    <p>Options: {item.foodOptions.join(', ')}</p>
                  )}
                  {item.foodExtras.length > 0 && (
                    <p>Extras: {item.foodExtras.join(', ')}</p>
                  )}
                  {item.foodOtherRequest &&
                    item.foodOtherRequest.trim() !== '' && (
                      <p>Other Requests: {item.foodOtherRequest}</p>
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="button-container">
            {!tableData.Served && (
              <Button
                className="cart-order-box"
                onClick={handleUpdateServed}
                variant="contained"
                sx={{
                  backgroundColor: '#e56b6f',
                  marginTop: 2,
                  width: '100%',
                  height: 50,
                  ':hover': {
                    background: '#F5F5F5',
                    color: 'black',
                    fontWeight: 'bold',
                  },
                }}
              >
                Mark Served Complete
              </Button>
            )}
            {tableData.NeedAssistance && (
              <Button
                className="cart-order-box"
                onClick={handleUpdateAssistance}
                variant="contained"
                sx={{
                  backgroundColor: '#e56b6f',
                  marginTop: 2,
                  width: '100%',
                  height: 50,
                  ':hover': {
                    background: '#F5F5F5',
                    color: 'black',
                    fontWeight: 'bold',
                  },
                }}
              >
                Mark Assistance Complete
              </Button>
            )}
          </div>
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default WaitStaffFoodDashboard;
