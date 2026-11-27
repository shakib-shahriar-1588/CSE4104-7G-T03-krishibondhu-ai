const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String 
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['FARMER', 'ADVISOR', 'ADMIN'], 
    default: 'FARMER' 
  },
  preferred_language: { 
    type: String, 
    enum: ['BN', 'EN'], 
    default: 'BN' 
  },
  district: { 
    type: String 
  },
  upazila: { 
    type: String 
  },
  account_status: { 
    type: String, 
    enum: ['ACTIVE', 'SUSPENDED'], 
    default: 'ACTIVE' 
  },
  last_login: { 
    type: Date 
  },
  // --- New fields for Password Reset ---
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { 
  // This automatically creates created_at and updated_at dates
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('User', userSchema);