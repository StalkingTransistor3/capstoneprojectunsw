const FoodItem = require('../models/foodItemModel');
const mongoose = require('mongoose');

// add food item
const addFoodItem = async (req, res) => {
  const foodItem = new FoodItem(req.body);
  foodItem
    .save()
    .then(() => res.status(201).send('Food item created'))
    .catch((error) => res.status(400).send(`Error: ${error}`));
};

// get all food item
const getFoodItems = async (req, res) => {
  FoodItem.find()
    .then((foodItems) => res.status(200).send(foodItems))
    .catch((error) => res.status(400).send(`Error: ${error}`));
};

// get one food item by id
const getFoodItem = async (req, res) => {
  const { id } = req.params;
  FoodItem.findOne({ _id: id })
    .then((foodItems) => res.status(200).send(foodItems))
    .catch((error) => res.status(400).send(`Error: ${error}`));
};

// search food item
const foodSearch = async (req, res) => {
  const searchQuery = req.query.q;
  console.log(`Search query: ${searchQuery}`);
  FoodItem.find({ food: { $regex: searchQuery, $options: 'i' } })
    .then((foodItems) => {
      console.log(`Found ${foodItems.length} items`);
      res.status(200).send(foodItems);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      res.status(400).send(`Error: ${error}`);
    });
};

// search food item by times ordered
const foodSearchTimesOrdered = async (req, res) => {
  const minTimesOrdered = req.query.q;
  // query needs to be converted to int because all queries are strings
  FoodItem.find({ timesOrdered: { $gte: parseInt(minTimesOrdered) } })
    .then((foodItems) => {
      console.log(`Found ${foodItems.length} items`);
      res.status(200).send(foodItems);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      res.status(400).send(`Error: ${error}`);
    });
};

// search food item by category
const foodSearchCategory = async (req, res) => {
  const searchQuery = req.query.q;
  console.log(`Search query: ${searchQuery}`);
  FoodItem.find({ category: { $regex: searchQuery, $options: 'i' } })
    .then((foodItems) => {
      console.log(`Found ${foodItems.length} items`);
      res.status(200).send(foodItems);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      res.status(400).send(`Error: ${error}`);
    });
};

// search all special food items
const foodSearchSpecial = async (req, res) => {
  FoodItem.find({ special: true })
    .then((foodItems) => {
      console.log(`Found ${foodItems.length} items`);
      res.status(200).send(foodItems);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      res.status(400).send(`Error: ${error}`);
    });
};

// delete a food item by id
const deleteFoodItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid food id' });
  }

  FoodItem.findOneAndDelete({ _id: id })
    .then((foodItem) => {
      console.log(`Deleted ${foodItem.food}`);
      res.status(200).send(foodItem);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      res.status(404).send(`Error: ${error}`);
    });
};

// update a food item information by id
const updateFoodItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid food id' });
  }

  FoodItem.findOneAndUpdate({ _id: id }, { ...req.body })
    .then((foodItem) => {
      console.log(`Updated ${foodItem.food}`);
      res.status(200).send(foodItem);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      res.status(404).send(`Error: ${error}`);
    });
};

module.exports = {
  addFoodItem,
  getFoodItem,
  getFoodItems,
  foodSearch,
  foodSearchCategory,
  foodSearchTimesOrdered,
  deleteFoodItem,
  updateFoodItem,
  foodSearchSpecial,
};
