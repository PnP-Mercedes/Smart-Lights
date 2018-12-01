contract Government {
    address private authority;
    mapping (address => uint8) public urgentVehicleList;
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