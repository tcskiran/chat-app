const asyncHandler = require('express-async-handler');

const Message = require('../models/messageModel');
const User = require('../models/userModel');

// sending message
// @path  -PRIVATE - POST - /api/messages/message
// @param -message -> Message to be sent
// @param -emailTo -> Email of reciever
const addMessage = asyncHandler(async (req, res) => {
  const { message, emailTo } = req.body;

  if (!message || message === '') {
    res.status(400);
    throw new Error('Please enter a message before sending');
  }

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

// get messages between user and another person
// @path  - PRIVATE - POST - /api/messages/
// @param -email1 -> Email of another person
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

const deleteMessage = asyncHandler(async (id) => {
  await Message.deleteOne({ _id: id });
});

module.exports = { addMessage, getMessages, deleteMessage };
