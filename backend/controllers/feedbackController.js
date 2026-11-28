const Feedback = require('../models/Feedback');

// @desc    Submit feedback for an AI message
const submitFeedback = async (req, res) => {
  try {
    const { message_id, rating, is_flagged, comment } = req.body;

    const feedback = await Feedback.create({
      message_id,
      user_id: req.user._id,
      rating, // 'HELPFUL' or 'NOT_HELPFUL'
      is_flagged,
      comment
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save feedback' });
  }
};

module.exports = { submitFeedback };