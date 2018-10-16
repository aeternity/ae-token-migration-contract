// Anleitung zum Filtern von Events nach indexed parametern: https://media.consensys.net/technical-introduction-to-events-and-logs-in-ethereum-a074d65dd61e

const Web3 = require("web3");
const axios = require('axios');
web3 = new Web3(new Web3.providers.WebsocketProvider('wss://kovan.infura.io/ws'));

var json = require("./tokenBurner_abi_without_checks.json");

const TokenBurner = new web3.eth.Contract(json, "0x4ecd812b010d9db16b0fb7143a79786b65b89b09");

TokenBurner.events.Burn({fromBlock: "latest" })
.on('data', function(event){
    console.log(event);
    let txID = event.transactionHash;
    let returns = event.returnValues;
    let value = parseInt(returns['_value']);
    let pubkey = web3.utils.toUtf8(returns['_pubkey']);

    axios.post(
        'https://api.backendless.com/CBD0589C-4114-2D15-FF41-6FC7F3EE8800/39EBBD6D-5A94-0739-FF27-B17F3957B700/data/TokenBurnings', 
        {"count" : returns['_count'],
        "deliveryPeriod" : returns['_deliveryPeriod'],
        "from" : returns['_from'],
        "pubKey" : pubkey,
        "value" : value,
        "transactionHash" : txID}
    ).then(function(response){
        if (response.status == 200) {
            console.log("Data saved with ID " + response.data['objectId']);
        } else if (response.status == 400) {
            console.log("FAILURE! Check parameters. It should not happen in production");
        } else {
            console.log(response);
        }
    }).catch((error) => console.log(error));
})
.on('error', function(error) {
    console.log(error);
});



