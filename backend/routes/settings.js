const express = require('express');
const router = express.Router();

// Get current settings
router.get('/', async (req, res) => {
  try {
    // TODO: Get settings from database
    res.json({
      telegramToken: process.env.TELEGRAM_BOT_TOKEN,
      telegramChatId: process.env.TELEGRAM_CHAT_ID,
      buyAmount: 1,
      slippage: 15,
      priorityFee: 5000,
      minContractScore: 85,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
router.post('/', async (req, res) => {
  try {
    const {
      telegramToken,
      telegramChatId,
      buyAmount,
      slippage,
      priorityFee,
      minContractScore,
    } = req.body;

    // TODO: Save settings to database
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router; 