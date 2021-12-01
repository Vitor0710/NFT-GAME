require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.7",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: process.env.REACT_APP_PROJECT_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KEY]
    },
  }
};
