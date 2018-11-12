const path = require('path')
const fs = require('fs')
const solc = require('solc')
const Web3 = require('web3')

console.warn(process.env.WEB3_PROVIDER)
let web3 = new Web3(process.env.WEB3_PROVIDER || '127.0.0.1:8545')

const cc = fs.readFileSync(path.resolve(__dirname, 'contracts', 'TokenBurner.sol'), 'UTF-8')

let out = solc.compile(cc, 1)

const b = out.contracts[':TokenBurner'].bytecode
const abi = JSON.parse(out.contracts[':TokenBurner'].interface)
const contract = new web3.eth.Contract(abi).deploy({
	data: '0x' + b,
	arguments: [process.env.MIGRATION_ADMIN_ADDRESS, process.env.TOKEN_CONTRACT_ADDRESS]
})


contract.estimateGas(function(err, gas){
	console.log("gas:", gas);
	console.log("calldata:", contract.encodeABI())
	console.log("solc version:", solc.version())
});

