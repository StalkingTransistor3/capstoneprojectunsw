import React, { useState } from 'react';
import CartContext from './CartContext';

const CartProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [counter, setCounter] = React.useState(0);

  const addToCart = (item) => {
    // if quant = 0 do not update cart
    if (item.quantity !== 0) {
      setFoodItems((prevFoodItems) => {
        const existingItem = prevFoodItems.find(
          (prevItem) => prevItem.id === item.id
        );

        if (existingItem) {
          existingItem.quantity = item.quantity;
          existingItem.price = item.price;
          return [...prevFoodItems];
        } else {
          item.id = counter + 1;
          setCounter((prevCounter) => prevCounter + 1);
          return [...prevFoodItems, item];
        }
      });
    }
  };

  const removeFromCart = (id) => {
    const updatedCartOrders = foodItems.filter((item) => item.id !== id);
    setFoodItems(updatedCartOrders);
  };

  const clearCart = (item) => {
    setFoodItems([]);
  };

  const sendOrder = async (tableNo, foodItems) => {
    const singleOrder = {
      TableNo: tableNo,
      FoodItems: foodItems.map((item) => {
        const orderItem = {
          foodName: item.name,
          foodQuantity: item.quantity,
          foodPrice: item.price,
          foodOptions: item.options || [],
          foodExtras: item.extras || [],
        };

        if (item.otherRequest) {
          orderItem.foodOtherRequest = item.otherRequest;
        }
        if (item.foodId) {
          orderItem.foodId = item.foodId;
        }

        return orderItem;
      }),
    };
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(singleOrder),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Order placement failed:', response.status);
      }
    } catch (error) {
      console.error('Error occurred during order placement:', error);
    }
  };

  const cartContextValue = {
    foodItems,
    addToCart,
    clearCart,
    removeFromCart,
    sendOrder,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
