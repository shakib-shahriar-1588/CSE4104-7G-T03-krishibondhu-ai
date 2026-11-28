const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  message_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: String, enum: ['HELPFUL', 'NOT_HELPFUL'], required: true },
  is_flagged: { type: Boolean, default: false },
  comment: { type: String },
  review_status: { type: String, enum: ['PENDING', 'REVIEWED'], default: 'PENDING' },
  advisor_note: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);