const restrictToAdmin = (req, res, next) => {
    // Check if the user has doctor role
    if (req.user.role !== 'doctor') {
      res.status(403);
      throw new Error('Access denied. You are not authorized to perform this action.');
    }
    // If the user has admin role, allow them to proceed
    next();
  };
  
  module.exports = restrictToAdmin;
  