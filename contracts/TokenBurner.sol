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

// TODO: Run this in the EVM to make sure that this actually does what we want
//       it to do.
contract TokenBurner {
    struct Claim {
        uint256[] amount;
        string[] pubkey; // if people burn tokens multiple times, we can either 
                          //1. store every AE-pubkey or 
                          //2. store only those which havn't been stored before, which would require a seperate mapping + array to iterate over, so I suggest we go with option 1.
    }
    
    
    // Store the hashes of Aadmins' msg.data used for counting up the AE delivery batch
    mapping (address => bytes32) private multiSigHashes;
    // Keep track of token burn batches - use this number for filtering in the emitted Burn event.
    uint16 public AEdeliveryBatchCounter = 0;
    
    // The admins which may count up the AE delivery batch count
    address public AEdmin1;
    address public AEdmin2;
    // multi sig for counting up the token delivery batch counter
    modifier onlyAEdmins() {
        // check if transaction sender is AEdmin.
        require (msg.sender == AEdmin1);
        _;
    }
    
    // TODO: Do we actually care who burned the tokens or should we just
    //       record pubkey => balance mappings?
    mapping(address => Claim) burned;
    uint256 public burnCount; // count the amount of burns for later filtering of all burnings
    
    constructor(address _AEdmin1){
        require (_AEdmin1 != 0x0);
        AEdmin1 = _AEdmin1;
    }
    
    function receiveApproval(
      address _from,
      uint256 _value,
      address _token,
      bytes _pubkey
    ) public returns (bool) {
        
        // Only let people burn AE through original AEToken contract.
        //require(msg.sender == 0x5CA9a71B1d01849C0a95490Cc00559717fCF0D1d);
        // We only care about the first 32 bytes, which should hold our new pub key.
        require(bytes(_pubkey).length == 52);
        
        require(tokenFallback(_token).transferFrom(_from, this, _value));
        burned[_from].pubkey.push(string(_pubkey)); // pushing pubkey and value, to allow 1 user burn n times to m pubkeys
        burned[_from].amount.push(_value);
        emit Burn(_from, _pubkey, _value, burnCount++, AEdeliveryBatchCounter);
        return true;
    }
    
    function countUpDeliveryBatch()
    public onlyAEdmins
    {
        ++AEdeliveryBatchCounter;
    }
    
    // proposing to index two events: _from for easier user support, and 
    // _deliveryPeriod for easy retrieval of all users to include in the next 
    // AE delivery period
    event Burn(address indexed _from, bytes _pubkey, uint256 _value, uint256 _count, uint16 indexed _deliveryPeriod);
}
/* 
contract TestContract {

    event Burn(address indexed _from, bytes32 _pubkey, uint256 _value, uint256 _count, uint16 indexed _deliveryPeriod);

    constructor() public {
    }

    function test(bytes32 _pubkey, uint256 _value, uint256 _count, uint16 _deliveryPeriod) public {
        emit Burn(msg.sender, _pubkey, _value, _count, _deliveryPeriod);
    }
} */