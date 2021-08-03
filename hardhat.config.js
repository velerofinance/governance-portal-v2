/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: '0.7.3',
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-kovan.alchemyapi.io/v2/key-here`
      }
    }
  }
};
