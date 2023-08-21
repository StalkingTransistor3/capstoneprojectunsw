const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//////////////////////////////////////////////////////////////////

const foodInstSchema = new Schema({
  foodName: {
    type: String,
    required: true,
  },
  foodPrice: {
    type: Number,
    required: false,
  },
  foodQuantity: {
    type: Number,
    required: true,
  },
  foodId: {
    type: String,
    required: false,
  },
  foodOptions: {
    type: [String],
    required: false,
    default: [],
  },
  foodExtras: {
    type: [String],
    required: false,
    default: [],
  },
  foodOtherRequest: {
    type: String,
    required: false,
    default: '',
  },
  ingredients: {
    type: String,
    required: false,
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
  alter: {
    type: String,
    required: false,
  },
});

//////////////////////////////////////////////////////////////////

// PENDING -> COOKING -> READY -> SERVED (waiting for payment) -> PAID
const StatusEnum = {
  PENDING: 'PENDING',
  COOKING: 'COOKING',
  READY: 'READY',
  SERVED: 'SERVED',
  PAID: 'PAID',
};

const orderSchema = new Schema(
  {
    TableNo: {
      type: Number,
      required: true,
    },
    FoodItems: {
      type: [foodInstSchema],
      required: false,
    },
    Served: {
      type: Boolean,
      required: false,
      default: false,
    },
    NeedAssistance: {
      type: Boolean,
      required: false,
      default: false,
    },
    Seated: {
      type: Boolean,
      required: false,
      default: true,
    },
    Feedback: {
      type: String,
      required: false,
      default: '',
    },
    Rating: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    Status: {
      type: String,
      enum: [
        StatusEnum.PENDING,
        StatusEnum.COOKING,
        StatusEnum.READY,
        StatusEnum.SERVED,
        StatusEnum.PAID,
      ],
      default: StatusEnum.PENDING,
    },
  },
  { timestamps: true },
);

//////////////////////////////////////////////////////////////////

module.exports = {
  Order: mongoose.model('Order', orderSchema),
  StatusEnum: StatusEnum,
};
