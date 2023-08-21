import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from '@mui/material/Button';

const WaitStaffFoodPayments = () => {
  const { tableNo } = useParams();
  const storedTableNo = localStorage.getItem('tableNo');
  const navigate = useNavigate();

  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(null);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let totalSum = 0;

    if (tableData && tableData.orders) {
      tableData.orders.forEach((order) => {
        order.FoodItems.forEach((item) => {
          totalSum += item.foodPrice * item.foodQuantity;
        });
      });
    }

    setTotal(totalSum);
  }, [tableData]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch(`/api/orders/pending-payments`);
        if (response.ok) {
          const data = await response.json();
          const targetTable = data.find(
            (table) => table.TableNo === parseInt(storedTableNo)
          );
          setTableData(targetTable);
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
    navigate('/dashboardwait/pendingPayments');
  };

  const handleUpdatePaid = async (singleUniqueOrderID) => {
    try {
      const response = await fetch(
        `/api/orders/updatePaid/${singleUniqueOrderID}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setTableData({ ...tableData, Served: true });
        navigate('/dashboardwait/pendingPayments');
      } else {
        setError('An error #1 occurred while updating table data.');
      }
    } catch (error) {
      setError('An error #2 occurred while updating table data.');
    }
  };

  const handleUpdatePaidMany = async (uniqueOrderIDs) => {
    try {
      const response = await fetch(`/api/orders/updatePaidMany`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: uniqueOrderIDs }),
      });

      if (response.ok) {
        const updatedOrders = await response.json();
        setTableData({ ...tableData, Served: true, orders: updatedOrders });
        navigate('/dashboardwait/pendingPayments');
      } else {
        setError('An error occurred while updating table data.');
      }
    } catch (error) {
      setError('An error occurred while updating table data.');
    }
  };

  let uniqueOrderIDs = [];
  if (tableData) {
    uniqueOrderIDs = tableData.orders.map((order) => order._id);
  }

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
          <div className="customer-your-orders-container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingLeft: '20px',
              }}
            >
              <h4>Order Summary</h4>
              <h4 style={{ marginRight: '20px' }}>
                Total: A${total.toFixed(2)}
              </h4>
            </div>

            {tableData &&
              tableData.orders.map((order, orderIndex) => (
                <div key={orderIndex}>
                  <hr />
                  <div className="order-details" style={{ marginLeft: '20px' }}>
                    <h4>OrderID: {order._id}</h4>
                    <h4>Status: {order.Status}</h4>
                  </div>

                  <hr />
                  {order.FoodItems.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <div
                        className="quantity-box"
                        style={{ marginRight: '15px' }}
                      >
                        <p>{item.foodQuantity}</p>
                      </div>
                      <div
                        className="item-details"
                        style={{ marginRight: '15px' }}
                      >
                        <p>
                          <strong>{item.foodName}</strong>
                        </p>
                      </div>
                      <div
                        style={{
                          flexGrow: 1,
                          textAlign: 'right',
                          marginRight: '20px',
                        }}
                      >
                        <p>
                          <strong>
                            A${(item.foodPrice * item.foodQuantity).toFixed(2)}
                          </strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          {!tableData.Served && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                className="cart-order-box"
                onClick={() =>
                  uniqueOrderIDs.length === 1
                    ? handleUpdatePaid(uniqueOrderIDs[0])
                    : handleUpdatePaidMany(uniqueOrderIDs)
                }
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
                PAID
              </Button>
            </div>
          )}
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
};
export default WaitStaffFoodPayments;
