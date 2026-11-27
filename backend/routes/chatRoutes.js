const express = require('express');
const router = express.Router();
const { createSession, getSessions, getMessages, saveMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected (require login)
router.post('/session', protect, createSession);
router.get('/sessions', protect, getSessions);
router.get('/session/:sessionId', protect, getMessages);
router.post('/message', protect, saveMessage);

module.exports = router;