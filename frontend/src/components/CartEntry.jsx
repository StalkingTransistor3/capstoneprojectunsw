import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import CartContext from './../contexts/CartContext';
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

export default function CartEntry({
  foodName,
  foodQuantity,
  foodPrice,
  foodId,
  foodOptions,
  foodExtras,
  foodOtherRequest,
}) {
  // State of modal component
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Initial component data to contain food items ordered
  const [quantity, setQuantity] = React.useState(foodQuantity);
  const { foodItems, addToCart, removeFromCart } = useContext(CartContext);

  const [options, setOptions] = React.useState(foodOptions);
  const [extras, setExtras] = React.useState(foodExtras);
  const [otherRequest, setOtherRequest] = React.useState(foodOtherRequest);

  // handles the quantity of food ordered
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

  // Handles adding items to a cart that can be accessed by different components
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
      {/* Modal for food item */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* Food options bar */}
          <div className="food-options-bar"></div>
          {/* Recommendation entry */}
          <div className="recommendation-entry">
            {/* Food order data */}
            <div className="food-order-data">
              {/* Food name and price */}
              <div className="food-price-name">
                <div className="food-name">{foodName}</div>
              </div>
              {/* Food quantity adjust box */}
              <div className="food-quantity-alter-box">
                <div className="food-quantity-container">
                  {/* Increment button */}
                  <Button
                    className="quantity-button"
                    sx={{
                      backgroundColor: 'tomato',
                      width: windowWidth < 490 ? '30px' : '40px',
                      height: windowWidth < 490 ? '30px' : '40px',
                    }}
                    onClick={handleQuantity}
                    value="inc"
                    variant="contained"
                  >
                    ▲
                  </Button>
                  {/* Quantity display */}
                  <div className="food-quantity-total">{quantity}</div>
                  {/* Decrement button */}
                  <Button
                    className="quantity-button"
                    sx={{
                      backgroundColor: 'tomato',
                      width: windowWidth < 490 ? '30px' : '40px',
                      height: windowWidth < 490 ? '30px' : '40px',
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
          {/* Food options */}
          <div className="food-options">
            {/* Other requests textbox */}
            <textarea
              className="food-other-requests-text"
              placeholder="Other Requests"
              value={otherRequest}
              onChange={(e) => setOtherRequest(e.target.value)}
            ></textarea>
          </div>
          {/* Confirm button */}
          <div className="modal-submit-button-container">
            <Button
              onClick={handleSubmitItem}
              sx={{
                color: 'tomato',
                fontWeight: 'bold',
                marginTop: 4,
                marginLeft: '20px',
                marginBottom: 4,
                border: '1px tomato solid',
                ':hover': {
                  border: '1px tomato solid',
                },
              }}
              variant="outlined"
            >
              Confirm
            </Button>
          </div>
          {/* Food options bar */}
          <div className="food-options-bar"></div>
        </Box>
      </Modal>
      {windowWidth < 490 ? (
        <div className="recommendation-entry">
          {/* Food order data */}
          <div className="food-order-data">
            <div className="food-price-name">
               {/* Food name */}
              <div className="food-name">{foodName}</div>
            </div>
            <div className="food-quantity-alter-box">
              <div className="food-num-ordered">{foodQuantity}</div>
              <div className="food-price">
                {(foodPrice * foodQuantity).toFixed(2)}
              </div>
            </div>
            <div className="food-quantity-alter-box">
              <Button
                sx={{
                  color: 'red',
                  paddingTop: '12px',
                  marginTop: 0.5,
                  width: windowWidth < 490 ? '30px' : '40px',
                  height: windowWidth < 490 ? '30px' : '40px',
                }}
                onClick={() => removeFromCart(foodId)}
              >
                remove
              </Button>
              <Button
                onClick={handleOpen}
                variant="outlined"
                sx={{
                  borderRadius: 30,
                  fontWeight: 'bold',
                  marginTop: 0.5,
                  color: '#555555',
                  border: '1px #555555 solid',
                  width: windowWidth < 490 ? '30px' : '40px',
                  height: windowWidth < 490 ? '30px' : '40px',
                  ':hover': { border: '1px tomato solid' },
                }}
              >
                edit
              </Button>
            </div>

            {otherRequest !== '' && (
              <div className="cart-extra-subtext">
                Other Requests: {otherRequest}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="recommendation-entry">
            <div className="food-order-data">
              <div className="food-price-name">
                <div className="food-name">{foodName}</div>
              </div>
              <div className="food-quantity-alter-box">
                <div className="food-num-ordered">{foodQuantity}</div>
                <div className="food-price">
                  {(foodPrice * foodQuantity).toFixed(2)}
                </div>

                <Button
                  sx={{ color: 'red', paddingTop: '12px' }}
                  onClick={() => removeFromCart(foodId)}
                >
                  remove
                </Button>
                <Button
                  onClick={handleOpen}
                  variant="outlined"
                  sx={{
                    borderRadius: 30,
                    height: 50,
                    fontWeight: 'bold',
                    marginTop: 0,
                    color: 'tomato',
                    border: '1px tomato solid',
                    ':hover': { border: '1px tomato solid' },
                  }}
                >
                  +
                </Button>
              </div>
              {otherRequest !== '' && (
                <div className="cart-extra-subtext">
                  Other Requests: {otherRequest}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
