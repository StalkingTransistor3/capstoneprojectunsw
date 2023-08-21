import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
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

export default function RecoEntry({
  // Props for displaying the food item
  foodName = 'Food Name Here',
  foodPrice = 'Price',
  status = 'ordering',
  foodId,
}) {
  // State for whether modal is open
  const [open, setOpen] = React.useState(false);

  // Handlers for opening and closing modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // State for item quantity
  const [quantity, setQuantity] = React.useState(1);

  // Context for cart operations
  const { foodItems, addToCart } = useContext(CartContext);

  // State for other requests for food item
  const [otherRequest, setOtherRequest] = React.useState('');

  // Handler for adjusting quantity
  const handleQuantity = (e) => {
    // If "inc" is clicked and quantity is not at max limit, increment
    if (e.target.value === 'inc') {
      if (quantity !== 9) {
        setQuantity(quantity + 1);
      }
    }
    // If "dec" is clicked and quantity is not at min limit, decrement
    else if (e.target.value === 'dec') {
      if (quantity !== 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  // Handler for submitting the item
  const handleSubmitItem = () => {
    // Close the modal
    setOpen(false);

    // Create cart item object
    const cartOrder = {
      name: foodName,
      quantity: quantity,
      price: foodPrice,
      otherRequest: otherRequest,
    };
    // Add the item to the cart
    addToCart(cartOrder);
  };

  return (
    <>
      {/* Modal for food item */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-describedby="modal-modal-description"
      >
        <>
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
                  ':hover': { border: '1px tomato solid' },
                }}
                variant="outlined"
              >
                Confirm
              </Button>
            </div>

            {/* Food options bar */}
            <div className="food-options-bar"></div>
          </Box>
        </>
      </Modal>

      {/* Recommendation entry */}
      <div className="recommendation-entry">

        {/* Food order data */}
        <div className="food-order-data">
          {/* Food name */}
          <div className="food-price-name">
            <div className="food-name">{foodName}</div>
          </div>

          {/* Show different UI elements based on status */}
          {status === 'ordered' && (
            <>
              <div className="food-quantity-alter-box">
                <div className="food-num-ordered">1</div>
                <div className="food-price">{foodPrice}</div>
              </div>
            </>
          )}

          {status === 'cart' && (
            <>
              <div className="food-quantity-alter-box">
                <div className="food-quantity-container">{quantity}</div>
                <div className="food-price">{foodPrice * quantity}</div>
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
            </>
          )}

          {status === 'ordering' && (
            <>
              <div className="food-quantity-alter-box">
                <div className="food-price">{foodPrice}</div>
                <Button
                  onClick={handleOpen}
                  variant="outlined"
                  sx={{
                    borderRadius: 30,
                    width: windowWidth < 490 ? '30px' : '70px',
                    height: windowWidth < 490 ? '30px' : '50px',
                    fontWeight: 'bold',
                    marginTop: 1,
                    color: 'tomato',
                    border: '1px tomato solid',
                    ':hover': { border: '1px tomato solid' },
                  }}
                >
                  +
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
