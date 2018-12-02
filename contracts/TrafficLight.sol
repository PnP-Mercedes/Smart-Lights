pragma solidity >=0.4.22 <0.6.0;

contract TrafficLight {
    struct Location {
        string latitude;
        string longitude;
    }

    struct Bid {
        address bidder;
        uint mode;
        uint amount;
    }

    address private owner;
    uint public status;
    address public partnerLight;
    Location public location;
    address[] public bidderList;
    mapping (address => Bid) private bidList;

    constructor (string _latitude, string _longitude) public {
        owner = msg.sender;
        location = Location({
            latitude: _latitude,
            longitude: _longitude
        });
    }

    function bid(uint _mode) public payable {
        bidderList.push(msg.sender);
        bidList[msg.sender] = Bid({
            bidder: msg.sender,
            mode: _mode,
            amount: msg.value
        });
    }
    
    function getStatus() view external returns (uint) {
        return status;
    }
    
    function getBidderList() view external returns (address[]) {
        return bidderList;
    }
    
    function scoreBidders() view external returns (uint) {
        uint nBidder = bidderList.length;
        uint totalMode = 0;
        uint maxMode = 0;
        uint totalAmount = 0;
        for (uint i = 0; i < nBidder; i++) {
            Bid storage b = bidList[bidderList[i]];
            totalMode += b.mode;
            totalAmount += b.amount;
            if (b.mode > maxMode) {
                maxMode = b.mode;
            }
        }
        return totalAmount;
    }
    
    function controlBidders() public {
        TrafficLight partnerTL = TrafficLight(partnerLight);
        require(this.getStatus() == 0 &&  partnerTL.getStatus() == 2);
        uint myScore = this.scoreBidders();
        uint partnerScore = partnerTL.scoreBidders();
        if (myScore > partnerScore) {
            this.changeStatus(2);
            partnerTL.changeStatus(0);
            payBidders();
        }
    }
    
    function changeStatus(uint _status) public {
        status = _status;
    }
    
    function changePartnerLight(address _partnerAddr) public {
        require(msg.sender == owner);
        partnerLight = _partnerAddr;
    }
    
    function payBidders() private {
        uint i = 0;
        uint nBidder = bidderList.length;
        uint totalAmount = 0;
        for (i = 0; i < nBidder; i++) {
            totalAmount += bidList[bidderList[i]].amount;
        }
        TrafficLight partnerTL = TrafficLight(partnerLight);
        owner.transfer(totalAmount / 10);
        bidderList = partnerTL.getBidderList();
        nBidder = bidderList.length;
        for (i = 0; i < nBidder; i++) {
            bidderList[i].transfer((totalAmount * 9) / (nBidder * 10));
        }
    }
}