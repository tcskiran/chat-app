const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

// registering/creating user
// @path  - PUBLIC - POST - /api/users/register
// @param -name -> Name of user
// @param -email -> Email of user
// @param -password -> Password of user
// @param -passwordCheck -> Same password 2nd time
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, passwordCheck } = req.body;

  if (!name || !email || !password || !passwordCheck) {
    res.status(400);
    throw new Error('Fill all fields');
  }

  if (password !== passwordCheck) {
    res.status(400);
    throw new Error('Passwords not same');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hash,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
});

// logging in user
// @path  - PUBLIC - POST - /api/users/login
// @param -email -> Email of user
// @param -password -> Password of user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Fill both fields');
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// getting all users
// @path  - PUBLIC - GET - /api/users/
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select(
    '-password -createdAt -updatedAt -__v'
  );
  res.status(200).json({
    users,
  });
});

// creating jwt token
// @param id -> userID
// @return -> jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};

module.exports = { registerUser, loginUser, getUsers };
