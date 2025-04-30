const jwt = require('jsonwebtoken');
const tutor = require('../Models/tutorModel');

/**
 * Middleware to authenticate tutors using JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateTutor = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find tutor by id
    const tutorById = await tutor.findById(decoded.id);
    
    if (!tutorById) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.'
      });
    }

    // Attach tutorById object to request
    req.user = tutorById;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please login again.'
    });
  }
};

module.exports = {
  authenticateTutor
};