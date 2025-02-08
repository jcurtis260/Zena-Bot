const TelegramBot = require('node-telegram-bot-api');
const { chromium } = require('playwright');
const axios = require('axios');
const { Connection, PublicKey } = require('@solana/web3.js');
const TradingService = require('./trading');

class MemeBot {
  constructor(config) {
    this.telegramBot = new TelegramBot(config.telegramToken, { polling: true });
    this.telegramChatId = config.telegramChatId;
    this.connection = new Connection(config.rpcEndpoint);
    this.kols = ['CryptoNobler', 'Danny_Crypton', 'DefiWimar'];
    this.minContractScore = 85;
    this.browser = null;
    this.tradingService = new TradingService(config);
  }

  async start() {
    try {
      await this.initializeBrowser();
      this.startMonitoring();
      console.log('Bot started successfully');
    } catch (error) {
      console.error('Failed to start bot:', error);
    }
  }

  async initializeBrowser() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox']
    });
  }

  async startMonitoring() {
    setInterval(async () => {
      await this.monitorKOLTweets();
      await this.analyzeMemecoins();
    }, 60000); // Run every minute
  }

  async monitorKOLTweets() {
    if (!this.browser) {
      await this.initializeBrowser();
    }

    for (const kol of this.kols) {
      try {
        const context = await this.browser.newContext();
        const page = await context.newPage();
        
        await page.goto(`https://twitter.com/${kol}`, {
          waitUntil: 'networkidle'
        });

        // Wait for tweets to load
        await page.waitForSelector('article', { timeout: 10000 });

        // Extract tweets
        const tweets = await page.$$eval('article', (articles) => {
          return articles.map(article => {
            const tweetText = article.textContent;
            const links = Array.from(article.querySelectorAll('a'))
              .map(a => a.href)
              .filter(href => href.includes('dexscreener.com') || href.includes('solscan.io'));
            return { tweetText, links };
          });
        });

        // Process tweets
        for (const tweet of tweets) {
          if (tweet.links.length > 0) {
            await this.processTweetLinks(tweet);
          }
        }

        await context.close();
      } catch (error) {
        console.error(`Error monitoring ${kol}:`, error);
      }
    }
  }

  async processTweetLinks(tweet) {
    for (const link of tweet.links) {
      try {
        if (link.includes('dexscreener.com')) {
          const tokenAddress = this.extractTokenAddress(link);
          if (tokenAddress) {
            const score = await this.checkContractScore(tokenAddress);
            if (score >= this.minContractScore) {
              // First analyze the token
              await this.analyzeMemecoins(tokenAddress);
              
              // If analysis looks good, attempt to snipe
              const snipeResult = await this.tradingService.snipeToken(
                tokenAddress,
                this.settings.buyAmount,
                this.settings.slippage,
                this.settings.priorityFee
              );

              if (snipeResult.success) {
                await this.sendTelegramAlert(`
🎯 Token Sniped Successfully!
Token: ${tokenAddress}
Amount: ${snipeResult.inputAmount} SOL
Signature: ${snipeResult.signature}
`);

                // Set up take profit monitoring
                this.monitorForTakeProfit(tokenAddress);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing tweet link:', error);
      }
    }
  }

  async monitorForTakeProfit(tokenAddress) {
    let initialPrice = null;
    const checkInterval = setInterval(async () => {
      try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
        const currentPrice = response.data.pairs[0].priceUsd;

        if (!initialPrice) {
          initialPrice = currentPrice;
          return;
        }

        const priceIncrease = ((currentPrice - initialPrice) / initialPrice) * 100;

        // If price has increased by 50% or more, sell 80%
        if (priceIncrease >= 50) {
          const sellResult = await this.tradingService.sellToken(tokenAddress, 80);
          
          if (sellResult.success) {
            await this.sendTelegramAlert(`
💰 Take Profit Executed!
Token: ${tokenAddress}
Sold Amount: ${sellResult.soldAmount}
Received: ${sellResult.receivedSol} SOL
Signature: ${sellResult.signature}
`);
            clearInterval(checkInterval);
          }
        }
      } catch (error) {
        console.error('Error monitoring take profit:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  async analyzeMemecoins(tokenAddress) {
    try {
      const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
      const tokenData = response.data.pairs[0];
      
      if (tokenData) {
        const message = `
🔍 New Token Found!
Symbol: ${tokenData.baseToken.symbol}
Price: $${tokenData.priceUsd}
24h Volume: $${tokenData.volume.h24}
Contract: ${tokenAddress}
DEXScreener: https://dexscreener.com/solana/${tokenAddress}
`;
        await this.sendTelegramAlert(message);
      }
    } catch (error) {
      console.error('Error analyzing memecoin:', error);
    }
  }

  extractTokenAddress(url) {
    const match = url.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
    return match ? match[0] : null;
  }

  async checkContractScore(address) {
    try {
      const response = await axios.get(`https://solsniffer.com/api/v1/contract/${address}`);
      const score = response.data.score;
      
      if (score < this.minContractScore) {
        await this.sendTelegramAlert(`⚠️ Low contract score (${score}) for ${address}`);
      }
      
      return score;
    } catch (error) {
      console.error('Error checking contract score:', error);
      return 0;
    }
  }

  async snipeToken(tokenAddress, amount = 1) {
    // Implement token sniping logic here
  }

  async sendTelegramAlert(message) {
    try {
      await this.telegramBot.sendMessage(this.telegramChatId, message);
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  }
}

module.exports = MemeBot; 