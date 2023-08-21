import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import RecoEntry from '../components/RecoEntry.jsx';
import { Button } from '@mui/material';

export default function CustomerHome() {
  // Retrieving table number from local storage
  const tableNumber = localStorage.getItem('tableNumber');

  // Hook for routing
  const navigate = useNavigate();

  // State for recommended food list
  const [foodList, setFoodList] = useState([]);
  const [specialList, setSpecialList] = useState([]);
  const [mergedList, setMergedList] = useState([]);

  // State for tracking assistance status
  const [assistanceStatus, setAssistanceStatus] = useState(false);

  // Function to fetch recommended food from the backend
  const getRecoFood = async () => {
    await fetch(`/api/foodItems/search-to?q=75`)
      .then((response) => response.json())
      .then((data) => {
        // Setting fetched data to the state
        setFoodList(data);
      });
  };

  const getSpecialFoods = async () => {
    await fetch(`/api/foodItems/search-special`)
      .then((response) => response.json())
      .then((data) => {
        setSpecialList(data);

        setMergedList([...new Set([...specialList, ...foodList])]);
      });
  };

  // Effect hook to get the recommended food on component mount
  useEffect(() => {
    getRecoFood();
    getSpecialFoods();
  }, []);

  useEffect(() => {
    const combinedList = [...foodList, ...specialList];
    const uniqueList = Array.from(
      new Map(combinedList.map((item) => [item['_id'], item])).values(),
    );
    setMergedList(uniqueList);
  }, [foodList, specialList]);

  // Effect hook to update assistance status
  useEffect(() => {
    const updateAssistanceStatus = async () => {
      try {
        const response = await fetch(
          `/api/orders/updateNeedAssistanceToTrue/${tableNumber}`,
          {
            method: 'PATCH',
          },
        );

        // If the request was successful, log the confirmation
        if (response.ok) {
          console.log('Assistance requested');
        } else {
          // Log the error if the request failed
          console.log('Error requesting assistance');
        }
      } catch (error) {
        console.log('Error requesting assistance:', error);
      }
    };

    // If assistance is required, send the update and reset the state
    if (assistanceStatus) {
      updateAssistanceStatus();
      setAssistanceStatus(false);
    }
  }, [assistanceStatus, tableNumber]);

  // Render method of the component
  return (
    <>
      <Header
        title="Home"
        buttonFunc="assistance"
        setAssistanceStatus={setAssistanceStatus}
      />
      <div className="customer-home-page-wrapper">
        <div className="customer-home-recommendations-title">
          Recommendations
        </div>

        <div className="recommendations-box">
          {/* Loop over foodList and render each item with RecoEntry component */}
          {mergedList.map((object) => (
            <RecoEntry
              key={object.id}
              foodName={object.food}
              foodPrice={object.price}
              status="ordering"
            />
          ))}
        </div>
        <Footer setAssistanceStatus={setAssistanceStatus} />
      </div>
    </>
  );
}
