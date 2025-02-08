const express = require('express');
const router = express.Router();

// Get tracked tokens
router.get('/', async (req, res) => {
  try {
    // TODO: Get tokens from database
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

// Add new token to track
router.post('/', async (req, res) => {
  try {
    const { address, symbol } = req.body;
    // TODO: Add token to database
    res.json({ message: 'Token added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add token' });
  }
});

module.exports = router; 