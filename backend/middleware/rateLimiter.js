const rateLimit = require('express-rate-limit');

// 1. Login Limiter (5 attempts per 15 mins)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts, please try again after 15 minutes.' }
});

// 2. Forgot Password Limiter (3 per hour)
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: 'Too many password reset requests, please try again later.' }
});

// 3. AI & Scan Limiter (20 per hour for guests, we can adjust later for logged-in)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { message: 'AI usage limit reached. Please try again in an hour.' }
});

module.exports = { loginLimiter, forgotPasswordLimiter, aiLimiter };