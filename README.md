# AETokenBurningProject
VUE-JS App for calling AEToken burning contract 

# What is this ? #
This is a proposed token burner contract embedded in Truffle + VueJS.

# How to use this ? #
1. When running ```truffle migrate --reset```, an instance of the AEToken contract is deployed, with 100 Tokens preassigned to the ```msg.sender```.

2. run ```truffle console``` (make sure web3 1.xx is installed in the node project)

3.  tell truffle to work with web3 1.0 by running ```var Web3latest = require('web3'); ``` in the truffle console we opened before.

4. get the address of the tokenburner contract you just deployed with ```TokenBurner.deployed() ``` and copy the address at the bottom of the output

5. This does not work for some reason: 

```
AEToken.deployed().then(function(instance){
    return instance.approveAndCall(" enterAddressOfTokenburnerContractHere ", "1000000000000000000", Web3latest.utils.fromUtf8("ak_wmZUvZWrVibPM2PuSGhgWmMQXchEWgRTbwBp7tYUcPyBYHnpR"), {from:web3.eth.coinbase})
}).then (function(result){
    console.log(result);
}) 
```

# To-Do #

As you see, the contract function call above is providing the parameters for ```approveAndCall()``` : The contract to call, the amount of tokens to burn and an example AE wallet address, passed as bytes.
The function call is reverting, and I didn't habe the time yet to figure out why. Possible solution: Use JS EVM in Remix and debug.
