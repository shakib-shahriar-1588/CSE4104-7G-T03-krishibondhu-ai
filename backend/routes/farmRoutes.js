const express = require('express');
const router = express.Router();
const { createRecord, getRecords, deleteRecord } = require('../controllers/farmController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRecord).get(protect, getRecords);
router.route('/:id').delete(protect, deleteRecord); // <-- Add this line

module.exports = router;