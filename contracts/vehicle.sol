pragma solidity >=0.4.22 <0.6.0;

contract Vehicle {

    struct Settings {
        uint8 mode;
        bool urgency;
    }

    address private owner;
    address private government;
    mapping (address => Settings) private settingList;

    constructor (address _governmentAddr) public {
        owner = msg.sender;
        government = _governmentAddr;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function registerVehicle() public {
        settingList[msg.sender] = Settings({
            mode: 0,
            urgency: false
        });
    }
    
    function setVehicleSettings(uint8 _mode, bool _urgency) public {
        settingList[msg.sender].mode = _mode;
        settingList[msg.sender].urgency = _urgency;
    }

}