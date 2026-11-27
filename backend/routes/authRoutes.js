const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword, 
  updateUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, forgotPasswordLimiter } = require('../middleware/rateLimiter');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/forgotpassword', forgotPasswordLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected Routes
router.put('/profile', protect, updateUserProfile);

module.exports = router;