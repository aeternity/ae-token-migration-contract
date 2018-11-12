const web3 = require('web3')
const abi = require('ethereumjs-abi')

/**
 * Should be called to pad string to a multiple of chars
 *
 * @method padRight
 * @param {String} string to be padded
 * @param {Number} characters that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
var padRight = (string, chars, sign) => {
	return string + (new Array(string.length % chars).join(sign ? sign : "0"))
};

/**
 * Should be called to pad string to a multiple of chars
 *
 * @method padLeft
 * @param {String} string to be padded
 * @param {Number} characters that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
var padLeft = (string, chars, sign) => {
	return (new Array(string.length % chars).join(sign ? sign : "0")) + string
};

var fromUtf8 = web3.utils.fromUtf8;
var toHex = web3.utils.toHex;

var aeToBytes = (addr) => {
	let hexAddr = fromUtf8(addr).slice(2);
	let len = toHex(hexAddr.length/2);

	return abi.rawEncode(['uint256'], [0x80]).toString('hex')
		+ abi.rawEncode(['uint256'], [len]).toString('hex')
		+ padRight(hexAddr, 64)
}

var hexToUtf8 = web3.utils.hexToUtf8;
var hexToNumber = web3.utils.hexToNumber;

Object.assign(exports, { padRight, padLeft, fromUtf8, toHex, aeToBytes, hexToUtf8, hexToNumber })
