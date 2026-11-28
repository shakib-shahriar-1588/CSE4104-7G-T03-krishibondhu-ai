const express = require('express');
const router = express.Router();
const { getUsers, toggleUserStatus, getFlaggedFeedback, reviewFeedback } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(admin); // Protects all routes below this line

router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/feedback', getFlaggedFeedback);
router.put('/feedback/:id', reviewFeedback);

module.exports = router;