const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'ADVISOR')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin or advisor' });
  }
};

module.exports = { admin };