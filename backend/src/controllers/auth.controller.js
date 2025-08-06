const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * User registration controller
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required (username, email, password)' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Create new user
    const user = await User.create({ username, email, password });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle known errors with friendly messages
    if (error.message === 'Email already in use' || 
        error.message === 'Username already taken') {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error registering user' });
  }
};

/**
 * User login controller
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

/**
 * Get current user controller
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // User is already added to req by auth middleware
    const { id, username, email, profile_image } = req.user;
    
    res.status(200).json({
      user: { id, username, email, profile_image }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Error getting user data' });
  }
};
