pragma solidity >=0.4.22 <0.6.0;

contract TrafficLight {
    struct Location {
        uint32 latitude;
        uint32 longitude;
    }

    struct Bid {
        address bidder;
        uint8 Mode;
        bool Urgency;
    
    }

    address private owner;
    uint8 public status;
    address[] private interLights;
    Location public location;
    Bid[] public incomingBids;

    constructor (uint32 _latitude, uint32 _longitude) public {
        owner = msg.sender;
        location = Location({
            latitude: _latitude,
            longitude: _longitude
        });
    }
}