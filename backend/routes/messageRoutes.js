const express = require('express');
const router = express.Router();

const { addMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/message', protect, addMessage);
router.post('/', protect, getMessages);

module.exports = router;
