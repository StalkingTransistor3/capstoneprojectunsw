import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

// Replace the 'orderData' variable with your actual order data

const OrderBacklog = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const formatDate = (createdAt) => {
    const dateObj = new Date(createdAt);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    // Convert hours to 12-hour format (am/pm)
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;

    // Add leading zero to minutes if needed
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
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

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredOrder = selectedDate
    ? orderData.filter((feedback) => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate.toDateString() === selectedDate.toDateString();
      })
    : orderData;

  const sortedOrder = filteredOrder.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  const calculateTotal = (foodItems) => {
    let total = 0;
    foodItems.map((item) => {
      total = total + item.foodPrice;
    });
    return total;
  };

  return (
    <div>
      <h2>Order Backlog</h2>
      <span>
        <b>Date Picker </b>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          isClearable
        />
      </span>

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
        {sortedOrder.map((order) => {
          if (order === null) {
            return null;
          }
          return (
            <Paper elevation={5} sx={{ paddingLeft: 2, paddingRight: 2 }}>
              <Typography variant="subtitle1">
                Ordered at: {formatDate(order.createdAt)}
              </Typography>
              <Typography variant="subtitle1">
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="button" display="block">
                {order.Status}
              </Typography>
              <Typography variant="subtitle1">
                Table No: {order.TableNo}
              </Typography>
              <Typography variant="subtitle1">Food Items:</Typography>
              <ul>
                {order.FoodItems.map((foodItem) => (
                  <li key={foodItem._id}>
                    {foodItem.foodName} ${foodItem.foodPrice}
                  </li>
                ))}
              </ul>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Total: ${calculateTotal(order.FoodItems)}
              </Typography>
            </Paper>
          );
        })}
      </div>
    </div>
  );
};

export default OrderBacklog;
