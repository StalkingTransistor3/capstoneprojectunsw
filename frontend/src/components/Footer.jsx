import React from 'react';
import { useNavigate, useEffect } from 'react-router';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeIcon from '@mui/icons-material/Home';
import BackHandIcon from '@mui/icons-material/BackHand';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Chatbot from './Chatbot';

export default function Footer({
  // Prop for setting the assistance status in parent component
  setAssistanceStatus,
}) {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State for whether assistance has been called
  const [assistanceCalled, setAssistanceCalled] = React.useState(false);

  // Handler for clicking the assistance button
  const handleAssistanceClick = () => {
    // If assistance has not been called, flip the state
    if (!assistanceCalled) {
      setAssistanceCalled(!assistanceCalled);
    }

    // If setAssistanceStatus function is provided, call it with true
    if (setAssistanceStatus) {
      setAssistanceStatus(true);
    }
  };

  // Rendering the component
  return (
    <>
      <div className="footer-wrapper">
        <div
          style={{ display: 'flex', position: 'absolute', background: 'red' }}
        >
          <Chatbot style={{ background: 'blue' }} />
        </div>

        <div className="footer-container">
          {/* Container for Home button */}
          <div className="footer-text-button-container withborder">
            {/* Button for navigating to the home page */}
            <Button
              sx={{
                color: 'white',
                width: '100%',
                height: '100%',
              }}
              onClick={() => {
                navigate('/CustomerHome');
              }}
            >
              <HomeIcon />
            </Button>
            HOME
          </div>

          {/* Container for Cart button */}
          <div className="footer-text-button-container withborder">
            {/* Button for navigating to the cart page */}
            <Button
              sx={{
                color: 'white',
                width: '100%',
                height: '100%',
              }}
              onClick={() => {
                navigate('/CustomerCart');
              }}
            >
              <AddShoppingCartIcon />
            </Button>
            CART
          </div>

          {/* Container for Menu button */}
          <div className="footer-text-button-container withborder">
            {/* Button for navigating to the menu page */}
            <Button
              sx={{
                color: 'white',
                width: '100%',
                height: '100%',
              }}
              onClick={() => {
                navigate('/CustomerMenu');
              }}
            >
              <MenuBookIcon />
            </Button>
            MENU
          </div>

          {/* Container for Assistance button */}
          <div className="footer-text-button-container">
            {/* Button for calling assistance */}
            <Button
              sx={{
                color: 'white',
                width: '100%',
                height: '100%',
              }}
              onClick={handleAssistanceClick}
            >
              {/* Show different icons based on whether assistance has been called */}
              {!assistanceCalled && <BackHandIcon />}
              {assistanceCalled && <HourglassBottomIcon />}
            </Button>
            {/* Show different texts based on whether assistance has been called */}
            {!assistanceCalled && <>ASSISTANCE</>}
            {assistanceCalled && (
              <div style={{ textAlign: 'center' }}>PLEASE WAIT FOR STAFF</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
