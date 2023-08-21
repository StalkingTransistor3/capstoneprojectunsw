import { Card } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const AssistanceManager = () => {
  const [orderData, setOrderData] = useState([]);

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
        console.log('this is order data:');
        setOrderData(
          respo
            .slice()
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
        );
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    refreshOrders();
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div
        className="paper-container"
        style={{
          display: 'flex',
          gap: '15px',
          paddingBottom: '10px',
          alignContent: 'center',
          marginTop: 'auto',
          paddingLeft: '10px',
          paddingTop: '20px',
          flexWrap: 'wrap',
        }}
      >
        {orderData.map((order) => {
          if (!order.NeedAssistance) {
            return null;
          }
          return (
            <Card
              style={{
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                background: '#d00000',
                width: '200px',
                height: '150px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'column',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                <InfoOutlinedIcon fontSize="large" />
                <h1>Table No: {order.TableNo}</h1>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default AssistanceManager;
