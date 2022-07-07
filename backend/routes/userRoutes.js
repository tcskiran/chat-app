const express = require('express');
const router = express.Router();
const {
  registerUser,
  checkEmail,
  loginUser,
  getUsers,
} = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/confirmation/:token', checkEmail);
router.post('/login', loginUser);
router.get('/', getUsers);

module.exports = router;
