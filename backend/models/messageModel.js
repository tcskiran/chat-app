const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    messageFrom: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    messageTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: 'string',
      required: [true, 'Please add a message'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
