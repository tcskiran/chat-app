const express = require('express');
const router = express.Router();

const { addMessage, getMessages } = require('../controllers/messageController');

router.post('/message', addMessage);
router.post('/', getMessages);

module.exports = router;
