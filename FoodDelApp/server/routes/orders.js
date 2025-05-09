const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const Order = require('../models/Order');

// Place new order (protected route)
router.post('/', authenticateUser, async (req, res) => {
  const { items, totalAmount, address } = req.body;

  if (!items || !totalAmount || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      address,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error); // Log full error stack for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user's orders (protected)
router.get('/my-orders', authenticateUser, async (req, res) => {
  try {
    // Populate food details in order items
    const orders = await Order.find({ userId: req.user.id }).populate('items.foodId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;
