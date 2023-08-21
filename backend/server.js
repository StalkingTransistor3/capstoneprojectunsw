require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// routes
const ordersRoutes = require('./routes/orderRoute');
const tablesRoutes = require('./routes/tableRoute');
const staffRoutes = require('./routes/staffRoute');
const foodItemRoutes = require('./routes/foodItemRoute');

const { PORT, MONGO_URI } = process.env;

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// custom middleware example
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/orders', ordersRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/staffs', staffRoutes);
app.use('/api/foodItems', foodItemRoutes);

// connect to db
mongoose
  .connect(MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(PORT, () => {
      console.log('listening on port', PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
