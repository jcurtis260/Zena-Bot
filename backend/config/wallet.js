const { Keypair } = require('@solana/web3.js');

// Load private key from secure environment variable
const privateKey = new Uint8Array(JSON.parse(process.env.WALLET_PRIVATE_KEY));
const wallet = Keypair.fromSecretKey(privateKey);

module.exports = wallet; 