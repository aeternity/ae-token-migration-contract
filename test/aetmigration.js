var TokenBurner = artifacts.require("./TokenBurner.sol")
const AEToken = artifacts.require("./TestToken.sol")

const utils = require('./utils.js')

contract('TokenBurner', function(accounts) {
	let token

	beforeEach(async () => {
		token = await AEToken.deployed()
		burner = await TokenBurner.deployed()

		await token.transfer(accounts[2], 10000, {from: accounts[1]})
	})

	it("initializes with token contract address", async () => {
		assert.equal(await burner.AEToken.call(), token.address, 'did not initialize with contract address')
	})

	it("burns tokens via approveAndCall with valid looking addresses", async () => {
		const addresses = [
			"ak_wmZUvZWrVibPM2PuSGhgWmMQXchEWgRTbwBp7tYUcPyBYHnpR",
			"ak_2KmwqoqCiaNA1jBeiEcNifku23QTes5h478Y8UVhEgWPnPYXY",
			"ak_v12Pf9vWcN5tSuN2SeFL3RmYUDpu7zeeUsSuAYwyGDMW9NX3B",
			"ak_35Wxqf2cbzQF5hEV1j9AdXQFTMxqKCwM7iMKNGcqSv47MXAj68",
			"ak_4Kr76woCtc3ehZ45K1sCrmgKX6gnh7qGhjSU1GZYqfLTTjtCgn",
			"ak_bmtGbfP3SdPoJNZCQGjjzbKRje15J9CEcWYaL1gZyv2qEyiMe",
			"ak_8wWs1j2vhgjexQmKfgEBrG8ysAucRJdb3jsag3PJKjEeXswb7"
		]

		let eventWatch = burner.Burn()

		for (const addr of addresses) {
			let b = utils.aeToBytes(addr)
			let preBurnBalance = await token.balanceOf(accounts[1])

			await token.approveAndCall(burner.address, 100, '0x' + b, {from: accounts[1]}).then((res) => {
				return eventWatch.get()
			}).then((events) => {
				assert.equal(addr, utils.hexToUtf8(events[0].args._pubkey))
				assert.equal(100, events[0].args._value)
			})

			let postBurnBalance = await token.balanceOf(accounts[1])
			assert.equal(preBurnBalance - 100, postBurnBalance)
		}
	})

	it("fails to burn tokens via approveAndCall with invalid looking addresses", async () => {
		const addresses = [
			"ak_",
			"ak",
			"a",
			"",
			"ak_4Kr76woCtc3ehZ45K1sCrmgKX6gnh7qGhjSU1GZYqfLTTjt",
		]

		for (const addr of addresses) {
			let b = utils.aeToBytes(addr)
			await token.approveAndCall(burner.address, 100, '0x' + b, {from: accounts[2]})
				.then(assert.fail)
				.catch((err) => { assert.isTrue(!!err) })
		}
	})

	it("admins can increment the batch counter", async () => {
		await burner.countUpDeliveryBatch({from: accounts[0]})
		assert.equal('1', (await burner.AEdeliveryBatchCounter.call()).toString())
	})

	it("only admins can increment the batch counter", async () => {
		burner.countUpDeliveryBatch({from: accounts[3]}).then(assert.fail).catch((err) => { assert.isTrue(!!err) })
		burner.countUpDeliveryBatch({from: accounts[0]}).then(assert.success).catch(assert.fail)
	})

	it("fails to burn tokens via approveAndCall from different contract", async () => {
		const address = "ak_wmZUvZWrVibPM2PuSGhgWmMQXchEWgRTbwBp7tYUcPyBYHnpR"
		let invToken = await AEToken.deployed()

		let b = utils.aeToBytes(address)
		await invToken.approveAndCall(burner.address, 100, '0x' + b, {from: accounts[4]})
			.then(assert.fail)
			.catch((err) => { assert.isTrue(!!err) })
	})
})

