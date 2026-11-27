const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  sender: { type: String, enum: ['USER', 'AI'], required: true },
  content: { type: String, required: true },
  image_url: { type: String }, // <-- ADDED THIS
  language: { type: String, enum: ['BN', 'EN'], default: 'BN' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);