const express = require('express');

const {
  getOrdersFeedback,
  createFeedback,
  getOrders,
  getOrder,
  getActiveOrders,
  getNotServedOrders,
  getNeedAssistanceOrders,
  getTableOrder,
  getNeedHelpOrder,
  getOrderIdList,
  createOrder,
  deleteOrders,
  deleteOrder,
  updateNeedAssistanceToFalse,
  updateNeedAssistanceToTrue,
  updateServedToFalse,
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
} = require('../controllers/orderController');

const router = express.Router();

//////////////////////////////////////////////////////////////////
// FEEDBACK
//////////////////////////////////////////////////////////////////

// GET /api/orders/feedback
router.get('/feedback', getOrdersFeedback);

// POST /api/orders/feedback
router.post('/feedback', createFeedback);

//////////////////////////////////////////////////////////////////
// ORDERS
//////////////////////////////////////////////////////////////////

// GET /api/orders
router.get('/', getOrders);

// GET /api/orders/active
router.get('/active', getActiveOrders);

// GET /api/orders/pending-payments
router.get('/pending-payments', getPendingPayments);

// GET /api/orders/not-served
router.get('/not-served', getNotServedOrders);

// GET /api/orders/need-assistance
router.get('/need-assistance', getNeedAssistanceOrders);

// GET /api/orders/need-help
router.get('/need-help', getNeedHelpOrder);

// GET /api/orders/id
router.get('/orderId', getOrderIdList);

// GET /api/orders/table/:id
// seated: true -> active
router.get('/table/:id', getTableOrder);

// GET /api/orders/:id
router.get('/:id', getOrder);

// GET /api/orders/table/seated/all
// seated: true -> active
router.get('/table/seated/all', getTableOrders);

//////////////////////////////////////////////////////////////////

// POST /api/orders --> creates a new order
router.post('/', createOrder);

// DELETE /api/orders --> deletes all orders
router.delete('/', deleteOrders);

// DELETE /api/orders/:id --> deletes a single order
router.delete('/:id', deleteOrder);

//////////////////////////////////////////////////////////////////

// PATCH /api/orders/updateNeedAssistanceToFalse/:id
router.patch('/updateNeedAssistanceToFalse/:id', updateNeedAssistanceToFalse);

// PATCH /api/orders/updateNeedAssistanceToTrue/:id
router.patch('/updateNeedAssistanceToTrue/:id', updateNeedAssistanceToTrue);

// PATCH /api/orders/updateNotServedToFalse/:id
router.patch('/updateServedToFalse/:id', updateServedToFalse);

// PATCH /api/orders/feedback/:id
router.patch('/feedback/:id', updateFeedback);

// PATCH /api/orders/updateToReady/:id
router.patch('/updateToReady/:id', updateToReady);

// PATCH /api/orders/:id --> flexible order update
router.patch('/:id', updateOrder);

//////////////////////////////////////////////////////////////////
// PATCH for status
//////////////////////////////////////////////////////////////////

// PATCH /api/orders/pendingToCooking/:id
router.patch('/pendingToCooking/:id', pendingToCooking);

// PATCH /api/orders/cookingToReady/:id
router.patch('/cookingToReady/:id', cookingToReady);

// PATCH /api/orders/readyToServed/:id
router.patch('/readyToServed/:id', readyToServed);

// PATCH /api/orders/servedToPaid/:id
router.patch('/servedToPaid/:id', servedToPaid);

// PATCH /api/orders/updatePaid/:id
router.patch('/updatePaid/:id', updatePaid);

// PUT /api/orders/updatePaidMany
router.put('/updatePaidMany', updatePaidMany);

module.exports = router;
