const FarmRecord = require('../models/FarmRecord');

// @desc    Create a new farm record
// @route   POST /api/records
const createRecord = async (req, res) => {
  try {
    // SECURITY FIX: Whitelist allowed fields to prevent mass assignment
    const record = await FarmRecord.create({ 
      user_id: req.user._id,
      crop_name: req.body.crop_name,
      field_name: req.body.field_name,
      area_decimal: req.body.area_decimal,
      sowing_date: req.body.sowing_date
    }); 
    res.status(201).json(record);
  } catch (error) {
    console.error("Farm Record Error:", error);
    res.status(500).json({ message: 'Failed to create record' });
  }
};

// @desc    Get all farm records for the logged-in user
// @route   GET /api/records
const getRecords = async (req, res) => {
  try {
    const records = await FarmRecord.find({ user_id: req.user._id }).sort({ created_at: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error("Fetch Records Error:", error);
    res.status(500).json({ message: 'Failed to fetch records' });
  }
};

// @desc    Delete a farm record
// @route   DELETE /api/records/:id
const deleteRecord = async (req, res) => {
  try {
    const record = await FarmRecord.findById(req.params.id);
    
    // Check if record exists and belongs to the user
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    if (record.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await record.deleteOne();
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error("Delete Record Error:", error);
    res.status(500).json({ message: 'Failed to delete record' });
  }
};

module.exports = { createRecord, getRecords, deleteRecord };