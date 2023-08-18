require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** 
 * @type import('hardhat/config').HardhatUserConfig 
 */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: 'localhost',
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      accounts: [process.env.REACT_APP_SEPOLIA_PRIVATE_KEY] 
    }
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    cache: "./src/backend/cache",
  },
  etherscan: {
    apiKey: process.env.REACT_APP_ETHERSCAN_API_KEY,
  }
};