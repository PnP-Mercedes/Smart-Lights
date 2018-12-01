pragma solidity >=0.4.22 <0.6.0;

contract Government {
    address private authority;
    mapping (address => uint8) public urgentVehicleList;
    address[] public lightList;
    
    constructor (uint32 _latitude, uint32 _longitude) public {
        authority = msg.sender;
    }
    
    function getLights() public view returns (address[]) {
        return lightList;
    }
}