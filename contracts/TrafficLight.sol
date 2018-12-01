pragma solidity >=0.4.22 <0.6.0;
contract TrafficLight {
    uint8 Status;
    address PartnerLight;

    struct Bid {
        address address;
        string Location;
        uint8 Mode;
        bool Urgency;
    }

    Bid[] IncomingBids;
}