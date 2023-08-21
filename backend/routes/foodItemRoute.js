const express = require('express');
const router = express.Router();

const {
  addFoodItem,
  getFoodItem,
  getFoodItems,
  foodSearch,
  foodSearchCategory,
  foodSearchTimesOrdered,
  deleteFoodItem,
  updateFoodItem,
  foodSearchSpecial,
} = require('../controllers/foodController');

router.post('/', addFoodItem);

router.get('/id/:id', getFoodItem);

router.get('/all', getFoodItems);

router.get('/search', foodSearch);

router.get('/search-cat', foodSearchCategory);

router.get('/search-to', foodSearchTimesOrdered);

router.get('/search-special', foodSearchSpecial);

router.delete('/:id', deleteFoodItem);

router.patch('/:id', updateFoodItem);

module.exports = router;
