const mongoose = require('mongoose');

const diseaseScanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  record_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmRecord' },
  image_url: { type: String, required: true },
  crop_name: { type: String },
  predicted_disease: { type: String },
  confidence: { type: Number },
  advice: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiseaseScan', diseaseScanSchema);