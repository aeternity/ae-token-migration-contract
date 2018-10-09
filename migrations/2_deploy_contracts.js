var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var AEToken = artifacts.require("./AEToken.sol");
var TokenBurner = artifacts.require("./TokenBurner.sol");

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
  await deployer.deploy(SimpleStorage);
  await deployer.deploy(AEToken); 
  await deployer.deploy(TokenBurner, accounts[0]); 
     
  }
)
};
