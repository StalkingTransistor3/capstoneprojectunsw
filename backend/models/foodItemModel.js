const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodItemSchema = new Schema({
  food: {
    type: String,
    required: false,
  },
  ingredients: {
    type: String,
    required: false,
  },
  timesOrdered: {
    type: Number,
    required: false,
    default: 0,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  category: {
    type: String,
    required: false,
    default: '',
  },
  available: {
    type: Boolean,
    required: false,
    default: true,
  },
  special: {
    type: Boolean,
    required: false,
    default: false,
  },
  available: {
    type: Boolean,
    required: false,
    default: true,
  },
  special: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model('foodItem', foodItemSchema);
