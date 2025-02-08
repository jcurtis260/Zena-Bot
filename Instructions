# Solana Memecoin Trading Bot

## Overview
An automated trading bot that monitors Solana KOL (Key Opinion Leaders) Twitter accounts for new memecoin mentions, analyzes them, and executes trades based on predefined criteria.

## Core Features

### 1. Token Discovery
- Monitors Twitter accounts of major Solana KOLs:
  - CryptoNobler
  - Danny_Crypton
  - DefiWimar
- Extracts token contract addresses from:
  - DexScreener links
  - Solscan links
- Stores discovered tokens in MongoDB database

### 2. Token Analysis
- Contract Safety:
  - Checks contract score via solsniffer.com
  - Alerts if score < 85
  - Rejects tokens with unsafe contracts
- Market Analysis:
  - Queries DexScreener API for token data
  - Tracks price and volume metrics
  - Monitors social media hype
- Cross-references with pump.fun/board

### 3. Trading Logic
- Buy Conditions:
  - Contract score ≥ 85
  - Mentioned by tracked KOLs
  - Passes market analysis checks
- Trading Parameters:
  - Buy amount: 1 SOL (configurable)
  - Slippage: 15% (configurable)
  - Priority fees: Automatic adjustment
  
### 4. Take Profit Strategy
- Monitors price after purchase
- Sells 80% of holdings at 50% profit
- Keeps 20% as moonbag for potential further gains
- Automatic execution via Jupiter aggregator

### 5. Notifications
- Telegram Integration:
  - New token discoveries
  - Safety score alerts
  - Trade executions
  - Take profit triggers
  - Error notifications

### 6. Web Interface
- Configuration Settings:
  - Telegram bot token
  - Telegram chat ID
  - Buy amount
  - Slippage tolerance
  - Priority fees
  - Minimum contract score
- Real-time monitoring
- Trading history

## Technical Components

### Backend
- Node.js server
- MongoDB database
- Playwright for Twitter scraping
- Jupiter SDK for trading
- Solana Web3.js
- Express API

### Frontend
- React with Vite
- Material-UI components
- Real-time updates
- Settings management

## Data Sources
1. Twitter (KOL monitoring)
2. solsniffer.com (Contract analysis)
3. dexscreener.com (Market data)
4. pump.fun (Additional verification)

## Trading Flow
1. KOL tweets new token
2. Bot extracts contract address
3. Checks contract safety score
4. Analyzes market metrics
5. If criteria met, executes buy
6. Monitors for take profit
7. Executes sell strategy
8. Sends notifications

## Planned Features
- AI prediction model for token success
- Enhanced social media analysis
- Multiple take profit levels
- Dynamic fee adjustment
- Portfolio tracking
- Performance analytics

## Requirements
- Node.js v16+
- MongoDB
- Solana wallet
- Telegram bot
- RPC endpoint

## Setup Guide

### 1. Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd solana-meme-bot

# Install dependencies
npm install
npm install @jup-ag/core @solana/spl-token

# Setup frontend
cd frontend
npm install
cd ..
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# MongoDB
MONGODB_URI=mongodb://localhost/solana-meme-bot

# Telegram (Get from @BotFather)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Solana
RPC_ENDPOINT=https://your-solana-rpc-endpoint
WALLET_PRIVATE_KEY=["your","private","key","array"]

# Bot Settings
MIN_CONTRACT_SCORE=85
```

### 3. Telegram Bot Setup
1. Message @BotFather on Telegram
2. Create new bot: `/newbot`
3. Copy the bot token to .env
4. Start chat with your bot
5. Get chat ID: Visit `https://api.telegram.org/bot<YourBOTToken>/getUpdates`
6. Copy chat ID to .env

### 4. Solana Wallet Setup
1. Create or import a Solana wallet
2. Export private key as byte array
3. Add to .env as WALLET_PRIVATE_KEY
4. Ensure wallet has SOL for trading

### 5. Database Setup
```bash
# Start MongoDB
mongod

# Verify connection
mongo --eval "db.serverStatus()"
```

### 6. Running the Bot
```bash
# Terminal 1 - Start backend
npm run start:backend

# Terminal 2 - Start frontend
npm run start:frontend
```

### 7. Web Interface
1. Open http://localhost:3000
2. Configure settings:
    - Telegram credentials
    - Trading parameters
    - Contract score threshold

### 8. Verification Steps
1. Check Telegram bot sends test message
2. Verify MongoDB connection
3. Confirm wallet connection
4. Test token discovery system

## Maintenance

### Regular Updates
```bash
git pull
npm install
cd frontend && npm install
```

### Monitoring
- Check logs in `backend/logs`
- Monitor MongoDB storage
- Review trading performance
- Verify Telegram notifications

### Troubleshooting

#### MongoDB Issues
```bash
# Check MongoDB status
mongo --eval "db.serverStatus()"
```

#### RPC Connection
- Test RPC endpoint: 
```bash
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' https://your-rpc-endpoint
```

#### Trading Issues
- Verify wallet balance
- Check transaction logs
- Monitor slippage settings

## Security Notes

1. Never share your private keys
2. Use dedicated trading wallet
3. Start with small amounts
4. Regularly backup database
5. Monitor bot activities

## Support

For issues and feature requests, please create an issue in the repository.

## Disclaimer

This bot is for educational purposes. Trade at your own risk. Always DYOR.

For installation and setup instructions, see SETUP.md

