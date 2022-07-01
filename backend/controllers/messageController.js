const asyncHandler = require('express-async-handler');

const Message = require('../models/messageModel');
const User = require('../models/userModel');

const addMessage = asyncHandler(async (req, res) => {
  const { message, emailTo } = req.body;

  const messageFrom = await User.findOne({ email: req.user.email });
  const messageTo = await User.findOne({ email: emailTo });

  const messageData = await Message.create({
    message,
    messageFrom,
    messageTo,
  });

  if (messageData) {
    res.status(201).json({
      _id: messageData._id,
      message: messageData.message,
      messageFrom: messageData.messageFrom.name,
      messageTo: messageData.messageTo.name,
    });
  } else {
    res.status(500);
    throw new Error('Some problem in adding message to server');
  }
});

const getMessages = asyncHandler(async (req, res) => {
  const { email1 } = req.body;

  const user1 = await User.findOne({ email: email1 });
  const user2 = await User.findOne({ email: req.user.email });

  const query = {
    $or: [
      { $and: [{ messageFrom: user1 }, { messageTo: user2 }] },
      { $and: [{ messageTo: user1 }, { messageFrom: user2 }] },
    ],
  };

  const options = {
    createdAt: 1,
  };

  const messages = await Message.find(query, options).select(
    'message messageFrom messageTo'
  );

  res.status(200).json({ messages, name1: user1?.name, name2: user2?.name });
});

module.exports = { addMessage, getMessages };
