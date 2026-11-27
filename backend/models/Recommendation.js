const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DiseaseScan' },
  rec_type: { type: String, enum: ['CROP', 'FERTILIZER', 'DISEASE', 'CHAT'], required: true },
  input_params: { type: Object },
  content: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);