const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  message: {
    type: 'string',
    required: [true, 'Please add a message'],
  },
});

module.exports = mongoose.model('Message', messageSchema);
