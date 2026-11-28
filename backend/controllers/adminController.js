const User = require('../models/User');
const Feedback = require('../models/Feedback');

// @desc    Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password_hash').sort({ created_at: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Toggle user status (SUSPEND/ACTIVE)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.account_status = user.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await user.save();
    
    res.status(200).json({ message: 'Status updated', status: user.account_status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// @desc    Get flagged AI responses
const getFlaggedFeedback = async (req, res) => {
  try {
    // We populate the message_id to see the actual AI text
    const feedbacks = await Feedback.find({ is_flagged: true })
      .populate('message_id')
      .populate('user_id', 'full_name email')
      .sort({ created_at: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flagged feedback' });
  }
};

// @desc    Review a flagged response
const reviewFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    feedback.review_status = 'REVIEWED';
    feedback.advisor_note = req.body.advisor_note;
    await feedback.save();

    res.status(200).json({ message: 'Feedback reviewed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to review feedback' });
  }
};

module.exports = { getUsers, toggleUserStatus, getFlaggedFeedback, reviewFeedback };