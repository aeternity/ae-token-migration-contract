var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var AEToken = artifacts.require("./AEToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(AEToken);
};
