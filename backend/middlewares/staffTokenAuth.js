require('dotenv').config();
const { SECRET } = process.env;

const jwt = require('jsonwebtoken');
const Staff = require('../models/staffModel');

const requireAuth = async (req, res, next) => {
  // verify authentication

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, SECRET);

    req.staff = await Staff.findOne({ _id }).select(
      '_id first_name last_name employee_type',
    );
    next();
  } catch (error) {
    res.status(401).json({ error: 'Request not authorized' });
  }
};

module.exports = requireAuth;
