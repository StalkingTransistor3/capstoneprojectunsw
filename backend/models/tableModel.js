const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  tableNo: {
    type: Number,
    required: true,
    unique: true,
  },

  seats: {
    type: Number,
    required: true,
  },
  inMap: {
    type: Boolean,
    required: true,
    default: false,
  },
  x: {
    type: Number,
    required: false,
  },
  y: {
    type: Number,
    required: false,
  },
  width: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  radius: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model('table', tableSchema);
