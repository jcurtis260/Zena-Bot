const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
require('./models/Settings');
require('./models/Token');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/solana-meme-bot')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/settings', require('./routes/settings'));
app.use('/api/tokens', require('./routes/tokens'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 