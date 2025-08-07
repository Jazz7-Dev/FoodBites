const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport');

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body);
  console.log('Login request headers:', req.headers);

  const { identifier, password } = req.body; // identifier can be username or email

  try {
    console.log(`Login attempt for identifier: ${identifier}`);

    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user) {
      console.log('User not found for identifier:', identifier);
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match for user ${user.username}: ${isMatch}`);

    if (!isMatch) {
      console.log('Password mismatch for user:', user.username);
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    console.log('Login successful for user:', user.username);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, issue JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    // Redirect or respond with token
    // For simplicity, redirect to frontend with token as query param
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

module.exports = router;
