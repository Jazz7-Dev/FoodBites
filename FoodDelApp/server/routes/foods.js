// File: server/routes/foods.js
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // case-insensitive search
      query = {
        $or: [
          { cuisine: regex },
          { restaurant: regex },
          { name: regex }
        ]
      };
    }
    const foods = await Food.find(query);
    res.json(foods);
  } catch (error) {
    console.error('Failed to fetch foods:', error);
    res.status(500).json({ message: 'Failed to fetch foods' });
  }
});

module.exports = router;
