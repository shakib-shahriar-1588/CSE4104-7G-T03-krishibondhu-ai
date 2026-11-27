const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');

const getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user_id: req.user._id }).sort({ updated_at: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load sessions' });
  }
};

const getMessages = async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.sessionId);
    if (!session || session.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }
    const messages = await ChatMessage.find({ session_id: req.params.sessionId }).sort({ created_at: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
};

const createSession = async (req, res) => {
  try {
    const session = await ChatSession.create({ user_id: req.user._id, title: req.body.title || 'New Chat' });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create session' });
  }
};

const saveMessage = async (req, res) => {
  try {
    const session = await ChatSession.findById(req.body.session_id);
    if (!session || session.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await ChatMessage.create({
      session_id: req.body.session_id,
      sender: req.body.sender,
      content: req.body.content,
      image_url: req.body.image_url // <-- SAVE IMAGE URL
    });

    await ChatSession.findByIdAndUpdate(req.body.session_id, { updated_at: Date.now() });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' });
  }
};

module.exports = { createSession, getSessions, getMessages, saveMessage };