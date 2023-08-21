const express = require('express');
const router = express.Router();

const {
  registerStaff,
  loginStaff,
  getStaffs,
  getOneStaff,
  deleteStaff,
  updateStaff,
  verifyStaff,
  forgotPassword,
  resetPassword,
} = require('../controllers/staffController');

// use login session token check middleware
const requireAuth = require('../middlewares/staffTokenAuth');

// all apis for management use token checks
router.use('/manage', requireAuth);

// GET /api/staffs/manage/all
router.get('/manage/all', getStaffs);
// GET /api/staffs/manage/:id
router.get('/manage/:id', getOneStaff);
// POST /api/staffs/register
router.post('/register', registerStaff);
// POST /api/staffs/login
router.post('/login', loginStaff);
// DELETE /api/staffs/unregister/:id
router.delete('/manage/unregister/:id', deleteStaff);
// PATCH /api/staffs/update/:id
router.patch('/manage/update/:id', updateStaff);
// POST /api/staffs/forgot-password
router.post('/forgot-password', forgotPassword);
// PATCH /api/staffs/reset-password/:token
router.patch('/reset-password/:token', resetPassword);
// PATCH /api/staffs/verify/:token
router.patch('/verify/:token', verifyStaff);

module.exports = router;
