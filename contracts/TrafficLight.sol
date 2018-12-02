pragma solidity >=0.4.22 <0.6.0;

contract TrafficLight {
    struct Location {
        string latitude;
        string longitude;
    }

    struct Bid {
        address bidder;
        uint8 mode;
    }

    address private owner;
    uint8 public status;
    address[] private interLights;
    Location public location;
    Bid[] public incomingBids;

    constructor (string _latitude, string _longitude) public {
        owner = msg.sender;
        location = Location({
            latitude: _latitude,
            longitude: _longitude
        });
    }

    function bid(uint8 _mode) public payable {
        incomingBids.push(Bid({
            bidder: msg.sender,
            mode: _mode
        }));
    }
}