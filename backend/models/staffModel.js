require('dotenv').config();
const { EMAIL_VERIFY, SECRET } = process.env;

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const staffSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    employee_type: {
      type: String,
      required: true,
      enum: ['manager', 'kitchen-staff', 'waiter'],
    },
    contact: {
      type: String,
    },
    expireAt: {
      type: Date,
      required: false,
    },
    emailToken: {
      type: String,
      required: false,
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

staffSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// register input validation and encryption
staffSchema.statics.register = async function (
  first_name,
  last_name,
  email,
  password,
  employee_type,
  contact,
) {

  if (!first_name || !last_name || !email || !password || !employee_type) {
    throw Error('All required fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Invalid email');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  if (EMAIL_VERIFY != '0') {
    const veri_token = crypto.randomBytes(32).toString('hex');
    const staff = await this.create({
      first_name,
      last_name,
      email,
      password: hash,
      employee_type,
      contact,
      emailToken: veri_token,
      expireAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    return staff;
  } else {
    const staff = await this.create({
      first_name,
      last_name,
      email,
      password: hash,
      employee_type,
      contact,
    });
    return staff;
  }
};

// login validations
staffSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const staff = await this.findOne({ email });

  if (!staff) {
    throw Error('Incorrect email');
  }

  if (staff.expireAt) {
    throw Error('Unverified account');
  }

  const match = await bcrypt.compare(password, staff.password);

  if (!match) {
    throw Error('Incorrect password');
  }

  return staff;
};

module.exports = mongoose.model('staff', staffSchema);
