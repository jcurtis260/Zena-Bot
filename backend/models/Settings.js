const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  telegramToken: {
    type: String,
    required: true,
  },
  telegramChatId: {
    type: String,
    required: true,
  },
  buyAmount: {
    type: Number,
    default: 1,
  },
  slippage: {
    type: Number,
    default: 15,
  },
  priorityFee: {
    type: Number,
    default: 5000,
  },
  minContractScore: {
    type: Number,
    default: 85,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Settings', SettingsSchema); 