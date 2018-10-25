pragma solidity ^0.4.24;

// Fallback ERC20 token definition.
contract tokenFallback {
    uint256 public totalSupply;

    function balanceOf(address _owner) public constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function approve(address _spender, uint256 _value) public returns (bool success);
    function allowance(address _owner, address _spender) public constant returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract TokenBurner {
    struct Claim {
        uint256[] amount;
        string[] pubkey;
    }

    // Keep track of token burn batches - use this number for filtering in the emitted Burn event.
    uint16 public AEdeliveryBatchCounter = 0;

    // The admin who may count up the AE delivery batch count
    address public AEdmin;

    // check if transaction sender is AEdmin.
    modifier onlyAEdmin() {
        require (msg.sender == AEdmin);
        _;
    }

    mapping(address => Claim) burned;
    // count the amount of burns for later filtering of all burnings
    uint256 public burnCount;

    constructor(address _AEdmin){
        require (_AEdmin != 0x0);
        AEdmin = _AEdmin;
    }
    
    // check if address starts with an ak_
    function checkAddress(bytes str) constant returns (bool) {
        bytes memory ak = "ak_";
        bytes memory result = new bytes(3);
        for(uint i = 0; i < 3; i++) {
            result[i-0] = str[i];
        }
        return (keccak256(result) == keccak256(ak));
    }

    function receiveApproval(
      address _from,
      uint256 _value,
      address _token,
      bytes _pubkey
    ) public returns (bool) {

        // Only let people burn AE through original AEToken contract.
        require(msg.sender == 0x5CA9a71B1d01849C0a95490Cc00559717fCF0D1d);
        
        // minimal form of type checking with room for unexpected outcomes of base58 encodings, feel free to make length range more precise
        require (_pubkey.length > 50 && _pubkey.length < 70);
        require (checkAddress(_pubkey));
        
        require(tokenFallback(_token).transferFrom(_from, this, _value));
        burned[_from].pubkey.push(string(_pubkey)); // pushing pubkey and value, to allow 1 user burn n times to m pubkeys
        burned[_from].amount.push(_value);
        emit Burn(_from, _pubkey, _value, ++burnCount, AEdeliveryBatchCounter);
        return true;
    }

    function countUpDeliveryBatch()
    public onlyAEdmin
    {
        ++AEdeliveryBatchCounter;
    }

    event Burn(address indexed _from, bytes _pubkey, uint256 _value, uint256 _count, uint16 indexed _deliveryPeriod);
}
