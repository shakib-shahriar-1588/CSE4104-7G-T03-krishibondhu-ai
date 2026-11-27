const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }); 
};

const registerUser = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { password, full_name } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    // SECURITY FIX: Force role to FARMER.
    const user = await User.create({
      full_name, email, password_hash, role: 'FARMER' 
    });

    res.status(201).json({
      _id: user.id, full_name: user.full_name, email: user.email, role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

    const user = await User.findOne({ email });
    
    if (user && user.account_status === 'SUSPENDED') {
      return res.status(403).json({ message: 'Account suspended. Contact support.' });
    }

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      user.last_login = Date.now();
      await user.save();
      res.json({
        _id: user.id, full_name: user.full_name, email: user.email, role: user.role,
        phone: user.phone, district: user.district, upazila: user.upazila,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link was sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/resetpassword/${resetToken}`;

    const message = `You requested a password reset. Click this link: \n\n ${resetUrl}`;

    try {
      await sendEmail({ email: user.email, subject: 'Password Reset', message });
      res.status(200).json({ success: true, message: 'If that email exists, a reset link was sent.' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ message: 'Email service error' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Process failed' });
  }
};

// ADDED BACK: Reset Password Logic
const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Reset failed' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.full_name = req.body.full_name || user.full_name;
      user.phone = req.body.phone || user.phone;
      user.district = req.body.district || user.district;
      user.upazila = req.body.upazila || user.upazila;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id, full_name: updatedUser.full_name, email: updatedUser.email,
        role: updatedUser.role, phone: updatedUser.phone, district: updatedUser.district,
        upazila: updatedUser.upazila, token: generateToken(updatedUser._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed' });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword, 
  updateUserProfile 
};