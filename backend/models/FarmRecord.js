const mongoose = require('mongoose');

const farmRecordSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crop_name: { type: String }, // <-- Added this field
  crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  field_name: { type: String },
  area_decimal: { type: Number },
  soil_type: { type: String },
  sowing_date: { type: Date },
  expected_harvest: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED'], default: 'ACTIVE' }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('FarmRecord', farmRecordSchema);