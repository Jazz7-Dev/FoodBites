const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

module.exports = router;
