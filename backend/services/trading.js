const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const { Jupiter } = require('@jup-ag/core');

class TradingService {
  constructor(config) {
    this.connection = new Connection(config.rpcEndpoint);
    this.wallet = config.wallet; // Your bot's wallet keypair
    this.jupiter = new Jupiter({
      connection: this.connection,
      cluster: 'mainnet-beta',
    });
  }

  async snipeToken(tokenAddress, amountInSol = 1, slippage = 15, priorityFee = 5000) {
    try {
      // Convert SOL amount to lamports
      const amountInLamports = amountInSol * 1e9;
      
      // Get token mint info
      const tokenMint = new PublicKey(tokenAddress);
      
      // Setup Jupiter swap
      const routes = await this.jupiter.computeRoutes({
        inputMint: new PublicKey('So11111111111111111111111111111111111111112'), // SOL
        outputMint: tokenMint,
        amount: amountInLamports,
        slippageBps: slippage * 100, // Convert percentage to basis points
      });

      if (routes.length === 0) {
        throw new Error('No routes found for swap');
      }

      // Get best route
      const bestRoute = routes[0];
      
      // Prepare transaction
      const { swapTransaction } = await this.jupiter.exchange({
        route: bestRoute,
        userPublicKey: this.wallet.publicKey,
      });

      // Add priority fee
      swapTransaction.instructions.forEach(ix => {
        ix.keys.forEach(key => {
          if (key.isSigner) {
            key.computeBudgetConfig = {
              units: 'CU',
              microLamports: priorityFee,
            };
          }
        });
      });

      // Sign and send transaction
      const signature = await this.connection.sendTransaction(swapTransaction, [this.wallet]);
      
      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature);
      
      // Return transaction details
      return {
        success: true,
        signature,
        inputAmount: amountInSol,
        outputAmount: bestRoute.outAmount,
        price: bestRoute.priceImpact,
      };

    } catch (error) {
      console.error('Error sniping token:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sellToken(tokenAddress, percentageToSell = 80) {
    try {
      const tokenMint = new PublicKey(tokenAddress);
      const tokenAccount = await Token.getAssociatedTokenAddress(
        TOKEN_PROGRAM_ID,
        tokenMint,
        this.wallet.publicKey
      );

      // Get token balance
      const balance = await this.connection.getTokenAccountBalance(tokenAccount);
      const amountToSell = (balance.value.uiAmount * percentageToSell) / 100;

      // Setup Jupiter swap (token to SOL)
      const routes = await this.jupiter.computeRoutes({
        inputMint: tokenMint,
        outputMint: new PublicKey('So11111111111111111111111111111111111111112'), // SOL
        amount: amountToSell * Math.pow(10, balance.value.decimals),
        slippageBps: 1500, // 15% slippage
      });

      if (routes.length === 0) {
        throw new Error('No routes found for swap');
      }

      const bestRoute = routes[0];
      const { swapTransaction } = await this.jupiter.exchange({
        route: bestRoute,
        userPublicKey: this.wallet.publicKey,
      });

      const signature = await this.connection.sendTransaction(swapTransaction, [this.wallet]);
      const confirmation = await this.connection.confirmTransaction(signature);

      return {
        success: true,
        signature,
        soldAmount: amountToSell,
        receivedSol: bestRoute.outAmount / 1e9,
      };

    } catch (error) {
      console.error('Error selling token:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = TradingService; 