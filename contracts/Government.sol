pragma solidity >=0.4.22 <0.6.0;

contract Government {
    address private authority;
    mapping (address => uint) public urgentVehicleList;
    address[] public lightList;
    
    constructor () public {
        authority = msg.sender;
    }
    
    function getLights() public view returns (address[]) {
        return lightList;
    }
    
    function addLight(address lightAddr) public {
        require(msg.sender == authority);
        lightList.push(lightAddr);
    }
}