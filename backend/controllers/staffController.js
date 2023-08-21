require('dotenv').config();
const { SECRET, EMAIL_VERIFY, DOMAIN, EMAIL_HOOK } = process.env;

const Staff = require('../models/staffModel');

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt');

// create login session token
const createToken = (_id, employee_type) => {
  return jwt.sign({ _id, employee_type }, SECRET, { expiresIn: '3d' });
};

// find all staffs
const getStaffs = async (req, res) => {
  if (!(req.staff.employee_type == 'manager')) {
    return res
      .status(401)
      .json({ error: 'only managers can access this data' });
  }
  const staffs = await Staff.find(
    {},
    {
      _id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      contact: 1,
      employee_type: 1,
      expireAt: 1,
    },
  ).sort({ createdAt: -1 });
  res.status(200).json(staffs);
};

// find a staff by their id
const getOneStaff = async (req, res) => {
  if (!(req.staff.employee_type === 'manager')) {
    return res
      .status(401)
      .json({ error: 'only managers can access this data' });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'staff not found' });
  }

  const staff = await Staff.findById(id, {
    _id: 1,
    first_name: 1,
    last_name: 1,
    email: 1,
    contact: 1,
    employee_type: 1,
  });

  if (!staff) {
    return res.status(404).json({ error: 'staff not found' });
  }

  res.status(200).json(staff);
};

// send email for verification
const email_verification = async (staff) => {
  const emailToSend = {
    emailRecipient: staff.email,
    emailSubject: 'Email Verification',
    emailBody: `Dear ${staff.first_name},\n\nPlease verify your email by clicking this link: ${DOMAIN}/login?verify=${staff.emailToken}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nYour Team`,
  };
  try {
    await axios.post(EMAIL_HOOK, emailToSend);
  } catch (error) {
    console.error(error);
    throw Error(
      'An error occurred while trying to send the verification email.',
    );
  }
};

// send email for password reset
const emailForgotPassword = async (staff) => {
  const emailToSend = {
    emailRecipient: staff.email,
    emailSubject: 'Reset Password',
    emailBody: `Dear ${staff.first_name},\n\nPlease reset your password by clicking this link: ${DOMAIN}/reset-password?token=${staff.resetToken}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nYour Team`,
  };
  try {
    await axios.post(EMAIL_HOOK, emailToSend);
  } catch (error) {
    console.error(error);
    throw Error(
      'An error occurred while trying to send the reset password email.',
    );
  }
};

// reset password: will send password reset email
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    staff.resetToken = resetToken;
    staff.resetTokenExpires = Date.now() + 3600000; // Token valid for 1 hour

    await staff.save();

    emailForgotPassword(staff); // Send the email

    res.status(200).json({ message: 'Reset Password email sent' });
  } catch (error) {
    console.log('Errorrrrrr');
    console.error(error.stack);
    res.status(400).json({ error: error.message });
  }
};

// reset password -> update user data here
const resetPassword = async (req, res) => {
  console.log('Reset Password begun');
  console.log(req.params);

  const { token } = req.params;
  const { password } = req.body;
  try {
    const allStaff = await Staff.find();
    const allResetTokens = allStaff.map((staff) => staff.resetToken);
    console.log('All reset tokens:', allResetTokens);

    // Try to find a staff member by the reset token only
    const staffByToken = await Staff.findOne({ resetToken: token });
    console.log('Staff found by reset token:', staffByToken);

    // Check the current timestamp
    console.log('Current timestamp:', Date.now());

    // If a staff member was found, log their token expiry timestamp
    if (staffByToken) {
      console.log(
        'Staff reset token expiry timestamp:',
        staffByToken.resetTokenExpires,
      );
    }

    // Now try to find a staff member with a valid, non-expired token
    const staff = await Staff.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });
    console.log('Staff found by reset token and expiry:', staff);

    if (!staff) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    staff.password = hash;
    staff.resetToken = undefined;
    staff.resetTokenExpires = undefined;

    await staff.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// register a new staff
const registerStaff = async (req, res) => {
  const { first_name, last_name, email, password, employee_type, contact } =
    req.body;
  try {
    const staff = await Staff.register(
      first_name,
      last_name,
      email,
      password,
      employee_type,
      contact,
    );

    if (EMAIL_VERIFY === '1') {
      console.log(staff);
      email_verification(staff);
      res.status(200).json({ verified: false });
    } else {
      // create a token
      const token = createToken(staff._id, staff.employee_type);
      res.status(200).json({ verified: true, staff, token });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// verify staff email
const verifyStaff = async (req, res) => {
  const { token } = req.params;

  if (EMAIL_VERIFY == '0') {
    res.status(200).json({ message: 'Verification successful' });
  } else {
    await Staff.findOneAndUpdate(
      { emailToken: token },
      { $unset: { expireAt: 1, emailToken: 1 } },
    ).then((staff) => {
      if (staff) {
        res.status(200).json({ message: 'Verification successful' });
      } else {
        res.status(400).json({ error: 'Invalid verification token' });
      }
    });
  }
};

// login a staff
const loginStaff = async (req, res) => {
  const { email, password } = req.body;
  try {
    const staff = await Staff.login(email, password);

    // create a token
    const token = createToken(staff._id, staff.employee_type);

    res
      .status(200)
      .json({
        _id: staff._id,
        first_name: staff.first_name,
        last_name: staff.last_name,
        email,
        employee_type: staff.employee_type,
        token,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a staff by their id
const deleteStaff = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'staff not found' });
  }

  const staff = await Staff.findOneAndDelete({ _id: id });

  if (!staff) {
    return res.status(404).json({ error: 'staff not found' });
  }

  res.status(200).json(staff);
};

// update a staff information by their id
const updateStaff = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'staff not found' });
  }

  const staff = await Staff.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!staff) {
    return res.status(404).json({ error: 'staff not found' });
  }

  res.status(200).json(staff);
};

module.exports = {
  registerStaff,
  verifyStaff,
  loginStaff,
  getStaffs,
  getOneStaff,
  deleteStaff,
  updateStaff,
  forgotPassword,
  resetPassword,
};
