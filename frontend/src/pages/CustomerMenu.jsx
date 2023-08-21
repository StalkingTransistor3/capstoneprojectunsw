import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

import RecoEntry from '../components/RecoEntry';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';

import CartContext from './../contexts/CartContext';
import TextField from '@mui/material/TextField';

import Typography from '@mui/material/Typography';

export default function CustomerMenu() {
  // State for the list of food items
  const [foodList, setFoodList] = React.useState([]);

  // State for search value
  const [search, setSearch] = React.useState('');

  // State for filter value
  const [filter, setFilter] = React.useState('');

  // Ref for storing unique categories of food
  const uniqueCategoriesArray = React.useRef([]);

  // Retrieving table number from local storage
  const tableNumber = localStorage.getItem('tableNumber');

  // State for assistance status
  const [assistanceStatus, setAssistanceStatus] = useState(false);

  // Effect hook to update the assistance status
  useEffect(() => {
    const updateAssistanceStatus = async () => {
      try {
        const response = await fetch(
          `/api/orders/updateNeedAssistanceToTrue/${tableNumber}`,
          {
            method: 'PATCH',
          },
        );

        // Logging based on the success or failure of request
        if (response.ok) {
          console.log('Assistance requested');
        } else {
          console.log('Error requesting assistance');
        }
      } catch (error) {
        console.log('Error requesting assistance:', error);
      }
    };

    // If assistanceStatus is true, update assistance status and reset the state
    if (assistanceStatus) {
      updateAssistanceStatus();
      setAssistanceStatus(false);
    }
  }, [assistanceStatus, tableNumber]);

  // Function to filter food items by category
  const handleFilterFood = async (query) => {
    setFilter(query);
    await fetch(`/api/foodItems/search-cat?q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        setFoodList(data);
      });
  };

  // Function to fetch all food items
  const getAllFood = async () => {
    await fetch(`/api/foodItems/search?q=`)
      .then((response) => response.json())
      .then((data) => {
        setFoodList(data);
      });
  };

  // Effect hook to fetch all food items when component mounts
  React.useEffect(() => {
    getAllFood();
  }, []);

  // Effect hook to populate uniqueCategoriesArray with unique categories when foodList updates
  React.useEffect(() => {
    if (foodList.length > 0 && uniqueCategoriesArray.current.length === 0) {
      const uniqueCategories = new Set(foodList.map((item) => item.category));
      uniqueCategoriesArray.current = Array.from(uniqueCategories);
    }
  }, [foodList]);

  // Rendering the component
  return (
    <>
      <Header title="Menu" buttonFunc="cross" />
      <div className="customer-home-page-wrapper">
        <div className="menu-tabs-container">
          {/* Button for showing all food items */}
          <Button
            className="menu-tab"
            variant="contained"
            sx={{
              width: '25%',
              backgroundColor: filter === '' ? 'lightgrey' : 'tomato',
              color: filter === '' ? 'black' : 'white',
              fontWeight: filter === '' ? 'bold' : 'normal',
              ':hover': {
                background: '#F5F5F5',
                color: 'black',
                fontWeight: 'bold',
              },
            }}
            onClick={() => {
              handleFilterFood('');
            }}
          >
            All
          </Button>
          {/* Loop over unique categories to create a Button for each category */}
          {uniqueCategoriesArray.current.map((category) => (
            <Button
              key={category}
              className="menu-tab"
              variant="contained"
              sx={{
                width: '25%',
                backgroundColor: filter === category ? 'lightgrey' : 'tomato',
                color: filter === category ? 'black' : 'white',
                fontWeight: filter === category ? 'bold' : 'normal',
                ':hover': {
                  background: '#F5F5F5',
                  color: 'black',
                  fontWeight: 'bold',
                },
              }}
              onClick={() => {
                handleFilterFood(category);
              }}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="customer-menu-search-container">
          {/* Search field */}
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: '600px',
              marginTop: '20px',
              marginBottom: '20px',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'tomato',
                },
              },
              '& .MuiFormLabel-root': {
                '&.Mui-focused': {
                  color: 'tomato',
                },
              },
            }}
          />
        </div>
        <div className="menu-box">
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1.6rem',
            }}
          >
            {filter}
          </Typography>
          {/* Loop over foodList and filter based on search value. Render each item with RecoEntry component */}
          {foodList
            .filter((item) =>
              item.food.toLowerCase().includes(search.toLowerCase()),
            )
            .map((object) => (
              <>
                <RecoEntry
                  foodName={object.food}
                  foodPrice={object.price}
                  status="ordering"
                />
              </>
            ))}
        </div>
        <Footer setAssistanceStatus={setAssistanceStatus} />
      </div>
    </>
  );
}
