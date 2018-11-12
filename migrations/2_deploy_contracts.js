var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var TestToken = artifacts.require("./TestToken.sol");
var TokenBurner = artifacts.require("./TokenBurner.sol");

module.exports = function(deployer, network, accounts) {
	deployer.then(async () => {
		await deployer.deploy(SimpleStorage);
		if (network == "live") {
			// On the mainnet the token contract is deployed at below address.
			await deployer.deploy(TokenBurner, accounts[0], '0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d');
		} else {
			var tok = await deployer.deploy(TestToken);
			await deployer.deploy(TokenBurner, accounts[0], tok.address);
		}
	})
};
