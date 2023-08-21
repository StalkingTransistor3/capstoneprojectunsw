import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CustomerWelcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState('');

  // On render, redirects the user to the correct page
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tableNumber = queryParams.get('table_number');
    setTableNumber(tableNumber); // Update the tableNumber state
    localStorage.setItem('tableNumber', tableNumber); // Store the table number in localStorage
    navigate('/CustomerHome');
  }, [location.search]);

  return (
    <></>
  );
}
