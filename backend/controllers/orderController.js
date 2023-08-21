const { default: mongoose } = require('mongoose');
const { Order, StatusEnum } = require('../models/orderModel');

// POST /api/orders/feedback --> creates a new feedback
const createFeedback = async (req, res) => {
  const { OrderID, OrderDate, Feedback } = req.body;
  try {
    const newFeedback = await OrderPost.create({
      OrderID,
      OrderDate: new Date(),
      Feedback,
    });
    res.status(200).json(newFeedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /api/orders/feedback --> gets all the order feedback, OrderID, and date
const getOrdersFeedback = async (req, res) => {
  try {
    const feedbacks = await Order.OrderPost({
      Feedback: { $exists: true },
    }).select('OrderID Feedback OrderedAt');
    res.status(200).json(
      feedbacks.map((order) => ({
        OrderID: order.OrderID,
        feedback: order.Feedback,
        date: order.OrderedAt,
      }))
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch OrderID Feedback OrderedAt' });
  }
};

//////////////////////////////////////////////////////////////////
// GET
//////////////////////////////////////////////////////////////////

// GET /api/orders --> gets all the order
const getOrders = async (req, res) => {
  // {createdAt: -1} -> desc order -> newest on top
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.status(200).json(orders);
};

// GET /api/orders/:id --> gets a single order
const getOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such order - getOrder' });
  }
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ error: 'No such order - getOrder' });
  }
  res.status(200).json(order);
};

// GET /api/orders/active --> get all --> Seated: true (customer still in restaurant)
const getActiveOrders = async (req, res) => {
  try {
    const activeOrders = await Order.find({ Seated: true })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(activeOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/orders/not-served --> get all --> Served: false & Seated: true
const getNotServedOrders = async (req, res) => {
  try {
    const activeOrders = await Order.find({ Served: false, Seated: true })
      .sort({ createdAt: -1 })
      .exec();
    if (activeOrders.length === 0) {
      return res
        .status(200)
        .json({ message: 'No tables require serving at the moment :)' });
    }
    res.status(200).json(activeOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/orders/need-assistance --> get all --> NeedAssistance: true & Seated: True
const getNeedAssistanceOrders = async (req, res) => {
  try {
    const activeOrders = await Order.find({
      NeedAssistance: true,
      Seated: true,
    })
      .sort({ createdAt: -1 })
      .exec();
    if (activeOrders.length === 0) {
      return res
        .status(200)
        .json({ message: 'No tables require assistance at the moment :)' });
    }
    res.status(200).json(activeOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/orders/table/:id --> gets a table information given tableNo and seated: true
const getTableOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ TableNo: id, Seated: true });
    if (!orders.length) {
      return res
        .status(404)
        .json({ error: 'No seated orders found for the specified tableNo' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/orders/table/seated/all --> gets a table information given seated: true
const getTableOrders = async (req, res) => {
  try {
    const order = await Order.find({ Seated: true });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/orders/id --> gets all id ever made
const getOrderIdList = async (req, res) => {
  try {
    const orders = await Order.find({}, '_id').sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }
    const orderIdList = orders.map((order) => order._id);
    res.status(200).json(orderIdList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/orders/need-help
const getNeedHelpOrder = async (req, res) => {
  try {
    const needHelpOrders = await Order.find({
      $or: [
        { Served: false, Seated: true },
        { NeedAssistance: true, Seated: true },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(needHelpOrders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
};

// GET /api/orders/pending-payments
const getPendingPayments = async (req, res) => {
  try {
    const activeOrders = await Order.find({
      Seated: true,
    })
      .sort({ createdAt: -1 })
      .exec();
    const combinedOrders = [];
    activeOrders.forEach((cur) => {
      let table = combinedOrders.find((t) => t.TableNo === cur.TableNo);
      if (!table) {
        table = { TableNo: cur.TableNo, orders: [] };
        combinedOrders.push(table);
      }
      table.orders.push({
        _id: cur._id,
        FoodItems: cur.FoodItems,
        Status: cur.Status,
      });
    });

    res.status(200).json(combinedOrders);
  } catch (error) {
    console.error('Error in getPendingPayments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//////////////////////////////////////////////////////////////////
// POST
//////////////////////////////////////////////////////////////////

// POST /api/orders
const createOrder = async (req, res) => {
  const { TableNo, FoodItems, Served } = req.body;
  try {
    const newOrder = await Order.create({
      TableNo,
      FoodItems,
      Served,
    });
    res.status(200).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//////////////////////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////////////////////

// DELETE /api/orders/:id --> deletes a single order
const deleteOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).json({ message: 'All orders have been deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete orders' });
  }
};

// DELETE /api/orders/:id --> deletes a single order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such order' });
  }
  const order = await Order.findOneAndDelete({ _id: id });
  if (!order) {
    return res.status(404).json({ error: 'No such order' });
  }
  res.status(200).json(order);
};

//////////////////////////////////////////////////////////////////
// PATCH
//////////////////////////////////////////////////////////////////

// PATCH /api/orders/updateNeedAssistanceToFalse/:id
const updateNeedAssistanceToFalse = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOneAndUpdate(
      { TableNo: id, Seated: true, NeedAssistance: true },
      { NeedAssistance: false },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/orders/updateNeedAssistanceToTrue/:id
const updateNeedAssistanceToTrue = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOneAndUpdate(
      { TableNo: id, Seated: true, NeedAssistance: false },
      { NeedAssistance: true },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/orders/updateServedToFalse/:id
const updateServedToFalse = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOneAndUpdate(
      { TableNo: id, Seated: true, Served: true },
      { Served: false },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/orders/feedback/:id
const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { Feedback } = req.body;
  const { Rating } = req.body;
  try {
    const order = await Order.findOneAndUpdate(
      { TableNo: id, Seated: true },
      { Feedback: Feedback, Rating: Rating },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/orders/updateToReady/:id
const updateToReady = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOneAndUpdate(
      { TableNo: id, Seated: true, Served: false, Status: 'Cooking' },
      { Status: 'Ready' },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//////////////////////////////////////////////////////////////////
// PATCH
//////////////////////////////////////////////////////////////////

const pendingToCooking = async (req, res) => {
  const { id } = req.params;
  try {
    const orderToUpdate = await Order.findOneAndUpdate(
      { _id: id, Seated: true, Served: false, Status: StatusEnum.PENDING },
      { Status: StatusEnum.COOKING },
      { new: true }
    );
    if (!orderToUpdate) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(orderToUpdate);
  } catch (error) {
    console.error('Error updating order:', error);
  }
};

const cookingToReady = async (req, res) => {
  const { id } = req.params;
  try {
    const orderToUpdate = await Order.findOneAndUpdate(
      { _id: id, Seated: true, Served: false, Status: StatusEnum.COOKING },
      { Status: StatusEnum.READY },
      { new: true }
    );
    if (!orderToUpdate) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(orderToUpdate);
  } catch (error) {
    console.error('Error updating order:', error);
  }
};

const readyToServed = async (req, res) => {
  const { id } = req.params;
  try {
    const orderToUpdate = await Order.findOneAndUpdate(
      { _id: id, Seated: true, Served: false, Status: StatusEnum.READY },
      { Served: true, Status: StatusEnum.SERVED },
      { new: true }
    );
    if (!orderToUpdate) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(orderToUpdate);
  } catch (error) {
    console.error('Error updating order:', error);
  }
};

const servedToPaid = async (req, res) => {
  const { id } = req.params;
  try {
    const orderToUpdate = await Order.findOneAndUpdate(
      { _id: id, Seated: true, Status: StatusEnum.SERVED },
      { Seated: false, Status: StatusEnum.PAID },
      { new: true }
    );
    if (!orderToUpdate) {
      return res
        .status(404)
        .json({ error: 'No order found for the specified tableNo' });
    }
    res.status(200).json(orderToUpdate);
  } catch (error) {
    console.error('Error updating order:', error);
  }
};

const updatePaid = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such order - updateOrderToPaid' });
  }
  const order = await Order.findOneAndUpdate(
    { _id: id, Seated: true },
    { Seated: false, Status: StatusEnum.PAID },
    { new: true }
  );
  if (!order) {
    return res.status(404).json({
      error:
        'No such order or order not eligible for update - updateOrderToPaid',
    });
  }
  res.status(200).json(order);
};

const updatePaidMany = async (req, res) => {
  const { ids } = req.body;
  const idArray = Array.isArray(ids) ? ids : [ids];
  try {
    const updateResult = await Order.updateMany(
      { _id: { $in: idArray }, Seated: true },
      { Seated: false, Status: StatusEnum.PAID }
    );
    if (!updateResult || updateResult.nModified == 0) {
      return res
        .status(404)
        .json({ error: 'No orders found for the specified IDs' });
    }
    const updatedOrders = await Order.find({ _id: { $in: idArray } });
    res.status(200).json(updatedOrders);
  } catch (error) {
    console.error('Error updating orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PATCH /api/orders/:id --> updates a single order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid order id' });
  }
  const order = await Order.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!order) {
    return res.status(404).json({ error: 'No such order - updateOrder' });
  }
  res.status(200).json(order);
};

module.exports = {
  getOrdersFeedback,
  createFeedback,
  getOrders,
  getOrder,
  getActiveOrders,
  getNotServedOrders,
  getNeedAssistanceOrders,
  getTableOrder,
  getOrderIdList,
  createOrder,
  deleteOrders,
  deleteOrder,
  updateNeedAssistanceToFalse,
  updateNeedAssistanceToTrue,
  updateServedToFalse,
  getNeedHelpOrder,
  updateFeedback,
  updateToReady,
  getTableOrders,
  updateOrder,
  pendingToCooking,
  cookingToReady,
  readyToServed,
  servedToPaid,
  getPendingPayments,
  updatePaid,
  updatePaidMany,
};
