import React, { useContext, useEffect, useState } from 'react';
import NavBar from './Navbar';
import NewItemForm from './NewItemForm';
import FoodCard from './FoodCard';
import { Tabs, Tab, Button, Grow } from '@mui/material';

const ManagerMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [foods, setFoods] = useState('');

  const [foodList, setFoodList] = useState([]);
  const [triggerRender, setTriggerRender] = useState(false);

  useEffect(() => {
    const response = fetch('/api/foodItems/all', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
        setFoods(respo);
        setFoodList(respo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [triggerRender]);

  const handleRender = () => {
    setTriggerRender(!triggerRender);
  };

  // Get unique categories from the foodList
  const categories = [...new Set(foodList.map((food) => food.category))];
  categories.unshift('All'); // Add 'All' as the first category option

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  return (
    <>
      <NewItemForm setRender={handleRender} />
      <div>
        {/* <Button onClick={handleButtonClick}> this is button</Button> */}

        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          style={{ paddingBottom: '15px' }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} value={category} />
          ))}
        </Tabs>

        <div
          className="card-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexGrow: '2',
            alignContent: 'space-around',
            gap: '30px',
          }}
        >
          {foodList
            .filter(
              (food) =>
                selectedCategory === 'All' ||
                food.category === selectedCategory,
            )
            .map((food) => (
              <FoodCard
                key={food._id}
                id={food._id}
                foodName={food.food}
                ingredients={food.ingredients}
                price={food.price}
                category={food.category}
                special={food.special}
                available={food.available}
                setRender={handleRender}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default ManagerMenu;
