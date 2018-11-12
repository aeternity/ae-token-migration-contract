// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var testhost = process.env.TESTHOST || '127.0.0.1'
var livehost = process.env.LIVEHOST || ''

module.exports = {
	networks: {
		development: {
			host: testhost,
			port: 8545,
			network_id: '*', // Match any network id
			gas: 6000000
		},
		live: {
			host: livehost,
			port: 8545,
			network_id: 1, // Match any network id
			gas: 6000000
		}
	},
	solc: {
		optimizer: {
			enabled: true,
			runs: 200
		}
	}
}
