import { Button } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderUpdateButton = (props) => {
  const action = props.action;
  const id = props._id;

  const handlePrepare = async () => {
    const postParams = {
      TableNo: props.TableNo,
      FoodItems: props.FoodItems,
      Status: 'COOKING',
    };

    const response = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('a4-token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postParams),
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    props.setRender();
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('a4-token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    props.setRender();
  };

  const handleReady = async () => {
    const postParams = {
      TableNo: props.TableNo,
      FoodItems: props.FoodItems,
      Status: 'READY',
    };

    const response = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('a4-token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postParams),
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    props.setRender();
    console.log(props);
  };

  return (
    <>
      {action === 'Prepare' && (
        <Button onClick={handlePrepare} variant="contained">
          <OutdoorGrillIcon />
          {action}
        </Button>
      )}

      {action === 'Delete' && (
        <Button onClick={handleDelete} color="error">
          <DeleteIcon />
        </Button>
      )}

      {action === 'Ready' && (
        <Button onClick={handleReady} variant="contained" color="success">
          <CheckCircleIcon />
          {action}
        </Button>
      )}
    </>
  );
};

export default OrderUpdateButton;
