const express = require('express');
const router = express.Router();
const { register, login, verify} = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

router.get('/verify', verify);

module.exports = router;
