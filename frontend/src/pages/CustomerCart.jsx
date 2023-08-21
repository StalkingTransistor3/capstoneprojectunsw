import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';

import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';

import CartContext from './../contexts/CartContext';
import Footer from '../components/Footer';
import RecoEntry from '../components/RecoEntry';
import CartEntry from '../components/CartEntry';
import FinalOrderEntry from '../components/FinalOrderEntry';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const windowWidth = window.innerWidth;
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: windowWidth < 490 ? windowWidth * 0.65 : 500,
  height: windowWidth < 490 ? windowWidth * 0.6 : 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 8,
  pl: 4,
};

export default function CustomerCart() {
  // State for open/close modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  // State initialization
  const tableNumber = localStorage.getItem('tableNumber');
  const [orderHistory, setOrderHistory] = React.useState([]);
  const [assistanceStatus, setAssistanceStatus] = useState(false);

  // State for rating and feedback
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = React.useState('');

  // Effect hook to update assistance status when button is clicked
  useEffect(() => {
    const updateAssistanceStatus = async () => {
      try {
        const response = await fetch(
          `/api/orders/updateNeedAssistanceToTrue/${tableNumber}`,
          {
            method: 'PATCH',
          },
        );

        if (response.ok) {
          console.log('Assistance requested');
        } else {
          console.log('Error requesting assistance');
        }
      } catch (error) {
        console.log('Error requesting assistance:', error);
      }
    };

    if (assistanceStatus) {
      updateAssistanceStatus();
      setAssistanceStatus(false);
    }
  }, [assistanceStatus, tableNumber]);

  // Function to get all orders for the table
  const getAllTableOrders = async () => {
    await fetch(`/api/orders/table/${tableNumber}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrderHistory(data);
        } else {
          console.error('Data received is not an array:', data);
          setOrderHistory([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setOrderHistory([]);
      });
  };

  // Call the getAllTableOrders function when the component is rendered
  React.useEffect(() => {
    getAllTableOrders();
  }, []);

  // Function to handle feedback submission
  const handleSubmitFeedback = async () => {
    handleClose();
    try {
      const response = await fetch(`/api/orders/feedback/${tableNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: tableNumber,
          Feedback: feedback,
          Rating: rating,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Feedback submitted successfully:', data);
      } else {
        console.log('Error submitting feedback:', await response.text());
      }
    } catch (error) {
      console.log('Error submitting feedback:', error);
    }
  };

  // Function to calculate the total cost of the order
  const calculateTotal = () => {
    let total = 0;
    orderHistory.forEach((order) => {
      order.FoodItems.forEach((item) => {
        total += item.foodPrice * item.foodQuantity;
      });
    });
    return total.toFixed(2);
  };

  const { foodItems, addToCart, removeFromCart, clearCart, sendOrder } =
    useContext(CartContext);

  var [total, setTotal] = React.useState(0);

  const [tab, setTab] = React.useState('newOrders');

  // Function to handle order submission
  const handleSubmitOrder = () => {
    if (tableNumber) {
      sendOrder(tableNumber, foodItems)
        .then(() => {
          console.log(foodItems);
          console.log('Order placement successful, tableNo is ', tableNumber);
          clearCart();
          navigate('/CustomerHome');
        })
        .catch((error) => {
          console.error('Order placement failed:', error);
        });
    } else {
      console.error('Table number not found');
    }
  };

  // Effect hook to calculate the total cost of the food items
  React.useEffect(() => {
    let sum = 0;

    foodItems.forEach((item) => {
      sum += parseFloat(item.price) * item.quantity;
    });

    const roundedSum = sum.toFixed(2);
    setTotal(roundedSum);
    //setTab('newOrders')
  }, [foodItems]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
            <div className="food-options-bar"></div>

            <div className="star-rating-box">
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      style={{ display: 'none' }}
                    />
                    <div
                      className="star-rating"
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    >
                      {ratingValue <= (hover || rating) ? (
                        <StarIcon sx={{ fontSize: '40px', color: 'tomato' }} />
                      ) : (
                        <StarOutlineIcon
                          sx={{ fontSize: '40px', color: '#444444' }}
                        />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="food-options">
              <textarea
                className="food-other-requests-text"
                placeholder="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>

            <div className="modal-submit-button-container">
              <Button
                onClick={handleSubmitFeedback}
                sx={{
                  color: 'tomato',
                  fontWeight: 'bold',
                  marginTop: 4,
                  marginLeft: '20px',
                  marginBottom: 4,
                  border: '1px tomato solid',
                  ':hover': { border: '1px tomato solid' },
                }}
                variant="outlined"
              >
                Submit
              </Button>
            </div>
            <div className="food-options-bar"></div>
          </Box>
        </>
      </Modal>
      <Header title={`Cart - Table ${tableNumber}`} buttonFunc="cross" />
      <div className="customer-home-page-wrapper">
        <div className="cart-tabs-container">
          <Button
            className="cart-tab"
            variant="contained"
            sx={{
              backgroundColor: 'tomato',
              color: 'white',
              ':hover': {
                background: '#F5F5F5',
                color: 'black',
                fontWeight: 'bold',
              },
            }}
            onClick={() => {
              setTab('newOrders');
            }}
          >
            New Orders
          </Button>
          <Button
            className="menu-tab"
            variant="contained"
            sx={{
              backgroundColor: 'tomato',
              color: 'white',
              ':hover': {
                background: '#F5F5F5',
                color: 'black',
                fontWeight: 'bold',
              },
            }}
            onClick={() => {
              setTab('allOrders');
            }}
          >
            All Orders
          </Button>
        </div>
        {/* Populating the orders container with new orders */}
        {tab === 'newOrders' ? (
          <>
            <div className="customer-your-orders-container">
              {foodItems.map((item) => (
                <div key={item.id}>
                  <CartEntry
                    foodName={item.name}
                    foodPrice={item.price}
                    foodQuantity={item.quantity}
                    foodId={item.id}
                    foodOptions={item.options}
                    foodExtras={item.extras}
                    foodOtherRequest={item.otherRequest}
                  />
                  <br />
                  <br />
                  <br />
                </div>
              ))}
            </div>

            <Button
              className="cart-order-box"
              onClick={handleSubmitOrder}
              variant="contained"
              sx={{
                backgroundColor: 'tomato',
                marginTop: 4,
                width: 200,
                height: 50,
                ':hover': {
                  background: '#F5F5F5',
                  color: 'black',
                  fontWeight: 'bold',
                },
              }}
            >
              Order
            </Button>
          </>
        ) : (
          <>
          {/* Populating the orders container with final orders */}
            <div className="customer-your-orders-container">
              {orderHistory.map((order) =>
                order.FoodItems.map((item) => (
                  <div key={item._id}>
                    <FinalOrderEntry
                      foodName={item.foodName}
                      foodPrice={item.foodPrice}
                      foodQuantity={item.foodQuantity}
                      foodId={item._id}
                      foodOptions={item.foodOptions}
                      foodExtras={item.foodExtras}
                      foodOtherRequest={item.foodOtherRequest}
                    />
                    <br />
                    <br />
                    <br />
                  </div>
                )),
              )}
            </div>
            <div className="orders-total-container">
              <span className="orders-total-box">Total</span>
              <span>${calculateTotal()}</span>
            </div>
            
            {/* Button that opens the modal for user feedback */}
            <div style={{ fontWeight: 'bold' }}>Please pay at the counter!</div>
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                backgroundColor: 'tomato',
                marginTop: 2,
                width: 200,
                height: 50,
                fontFaily: 'Montserrat',
                ':hover': {
                  background: '#F5F5F5',
                  color: 'black',
                  fontWeight: 'bold',
                },
              }}
            >
              Leave Feedback
            </Button>
          </>
        )}
        <Footer setAssistanceStatus={setAssistanceStatus} />
      </div>
    </>
  );
}
