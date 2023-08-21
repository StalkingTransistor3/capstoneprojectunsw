import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  Box,
  CardContent,
  Typography,
  Button,
  Badge,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OrderUpdateButton from './OrderUpdateButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const OrderCard = (props) => {
  const [foodNames, setFoodNames] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const foodList = props.foodItems;
  const orderId = props._id;
  const tableNo = props.TableNo;
  const foodItems = props.FoodItems;
  const status = props.Status;

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

  const orderedAt = formatDate(props.createdAt);

  return (
    <Card
      style={{
        display: 'flex',
        flexFlow: 'column',
        alignContent: 'space-around',
        width: '300px',
        background: '#faedcd',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CardHeader title={`Table ${tableNo}`} />
        {status === 'COOKING' && (
          <CircularProgress size={24} style={{ marginLeft: '8px' }} />
        )}
        {status === 'PENDING' && (
          <IconButton color="#e53e3e'">
            <ErrorIcon />
          </IconButton>
        )}
        {status === 'READY' && (
          <IconButton>
            <CheckCircleIcon style={{ color: 'pruple' }} />
          </IconButton>
        )}
      </div>

      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon /> {orderedAt}
          </div>
        </Typography>
        {foodItems.map((food, index) => (
          <>
            <Typography variant="body1">
              {itemCount + index}. {food.foodName}
            </Typography>
            {food.foodOtherRequest !== '' && (
              <Typography variant="subtitle2">
                {' '}
                • {food.foodOtherRequest}{' '}
              </Typography>
            )}
          </>
        ))}
      </CardContent>

      <div
        className="button-container"
        style={{
          display: 'flex',
          gap: '10px',
          paddingBottom: '10px',
          alignContent: 'center',
          marginTop: 'auto',
          paddingLeft: '10px',
        }}
      >
        <OrderUpdateButton {...props} action={'Prepare'} />
        <OrderUpdateButton {...props} action={'Ready'} />
        <OrderUpdateButton {...props} action={'Delete'} />
      </div>
    </Card>
  );
};

export default OrderCard;
