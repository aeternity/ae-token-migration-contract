// Anleitung zum Filtern von Events nach indexed parametern: https://media.consensys.net/technical-introduction-to-events-and-logs-in-ethereum-a074d65dd61e

const Web3 = require("web3");
web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

var json = require("./build/contracts/TokenBurner.json");

const instance = new web3.eth.Contract(json.abi, "0xff10c0f5e802b234523df0dad85c5403f1a63085");
// instance.getPastEvents(
//     "Transfer",
//     { fromBlock: 6439000, toBlock: "latest" },
//     (errors, events) => {
//         if (!errors) {
//             console.log(events);
//         } else {
//             console.log(errors);
//         }
//     }
// );


instance.events.ShowData({fromBlock: "latest" })
.on('data', function(event){
    console.log(event);
})
.on('changed', function(event){

})
.on('error', function(error) {
    console.log(error);
});



