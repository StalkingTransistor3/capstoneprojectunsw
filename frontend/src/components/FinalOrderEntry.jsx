import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import CartContext from './../contexts/CartContext';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 8,
  pl: 4,
};

export default function FinalOrderEntry({
  foodName,
  foodQuantity,
  foodPrice,
  foodId,
  foodOptions,
  foodExtras,
  foodOtherRequest,
}) {

  // States for handling the opening of the modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // States for keeping track of individual food items
  const [quantity, setQuantity] = React.useState(foodQuantity);
  const { foodItems, addToCart, removeFromCart } = useContext(CartContext);

  // States for food data
  const [options, setOptions] = React.useState(foodOptions);
  const [extras, setExtras] = React.useState(foodExtras);
  const [otherRequest, setOtherRequest] = React.useState(foodOtherRequest);

  // Handles customer increasing quantity of item for ordering
  const handleQuantity = (e) => {
    // Adding to cart
    if (e.target.value === 'inc') {
      if (quantity !== 9) {
        setQuantity(quantity + 1);
      }
    }
    // Removing from cart
    else if (e.target.value === 'dec') {
      if (quantity !== 0) {
        setQuantity(quantity - 1);
      }
    }
  };

  // Submits new ordered item to the backend and cart
  const handleSubmitItem = () => {
    setOpen(false);

    const newCartOrder = {
      name: foodName,
      quantity: quantity,
      price: foodPrice,
      options: options,
      extras: extras,
      otherRequest: otherRequest,
    };

    removeFromCart(foodId);
    addToCart(newCartOrder);
  };

  return (
    <>
      {/* Modal for users to edit food*/}
      <Modal
        open={open}
        onClose={handleClose}
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="recommendation-entry">
            {/* <div className="food-pic"></div> */}
            <div className="food-order-data">
              <div className="food-price-name">
                <div className="food-name">{foodName}</div>
              </div>
              <div className="food-quantity-alter-box">
                <div className="food-quantity-container">
                  <Button
                    className="quantity-button"
                    sx={{
                      backgroundColor: 'tomato',
                    }}
                    onClick={handleQuantity}
                    value="inc"
                    variant="contained"
                  >
                    ▲
                  </Button>
                  <div className="food-quantity-total">{quantity}</div>
                  <Button
                    className="quantity-button"
                    sx={{
                      backgroundColor: 'tomato',
                    }}
                    onClick={handleQuantity}
                    value="dec"
                    variant="contained"
                  >
                    ▼
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="food-options">
            <textarea
              className="food-other-requests-text"
              placeholder="Other Requests"
              value={otherRequest}
              onChange={(e) => setOtherRequest(e.target.value)}
            ></textarea>
          </div>
                    
          {/*Confirms order and sends it to the backend  */}
          <div className="modal-submit-button-container">
            <Button
              onClick={handleSubmitItem}
              variant="contained"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                marginTop: 4,
                marginLeft: '20px',
                border: '1px solid tomato',
                background: 'tomato',
                '&:hover': {
                  backgroundColor: '#333333',
                  border: '1px solid black',
                },
              }}
            >
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>
      
      {/* Populates the box with food items */}
      <div className="recommendation-entry">
        {/* <div className="food-pic"></div> */}
        <div className="food-order-data">
          <div className="food-price-name">
            <div className="food-name">{foodName}</div>
          </div>
          <div className="food-quantity-alter-box">
            <div className="food-num-ordered">{foodQuantity}</div>
            <div className="food-price">
              {(foodPrice * foodQuantity).toFixed(2)}
            </div>
          </div>
          {options.length !== 0 && (
            <div className="cart-extra-subtext">
              Options:{' '}
              {options.map((option) => (
                <>- {option} &nbsp;</>
              ))}
            </div>
          )}
          {extras.length !== 0 && (
            <div className="cart-extra-subtext">
              Extras:{' '}
              {extras.map((extra) => (
                <>- {extra} &nbsp;</>
              ))}
            </div>
          )}
          {otherRequest !== '' && (
            <div className="cart-extra-subtext">
              Other Requests: {otherRequest}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
