pragma solidity >=0.4.22 <0.6.0;
contract Vehicle {
    string Location;
    bool Urgency;
    
    function setLocation (string _location) public {
        Location = _location
    } 

    function setUrgenct (bool _urgency) public {
        Urgency = _urgency
    }
    
    function getNextLight() (address _nearestLight) {
            
        
    }
    
    function bidNearestLight() {

    }
}