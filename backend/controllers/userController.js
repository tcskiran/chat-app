const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL, // generated ethereal user
      pass: process.env.GMAIL_PASSWORD, // generated ethereal password
    },
  });

  const emailToken = generateToken(user._id);
  const url = `http://localhost:3000/confirmation/${emailToken}`;

  let mailOptions = {
    from: '"chat-app-admin 💬💬💬"', // sender address
    to: email, // list of receivers
    subject: 'Account confirmation for chat app', // Subject line
    html: `Please click the link to confirm your email: <a href="${url}">${url}</a>`, // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      res.status(500);
      throw new Error('Error in sending email');
    }
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

// email validation
// @path  - PUBLIC - GET - /api/users/confirmation/:token
// @param -token -> Email token of user
const checkEmail = asyncHandler(async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
    const user = await User.findByIdAndUpdate(decoded.id, { conform: true });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: req.params.token,
    });
  } catch (err) {
    res.status(401);
    throw new Error('Email token is tampered or expired');
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

  if (user && !user.conform) {
    throw new Error('Please confirm your email');
  }

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

module.exports = { registerUser, checkEmail, loginUser, getUsers };
