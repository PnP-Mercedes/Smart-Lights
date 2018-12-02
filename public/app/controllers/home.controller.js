var app = angular.module("smartlight", []);

app.controller('homeController', function($scope, $http, $interval) {
    $scope.lightList = [];
    $scope.lightLocations = [];
    $scope.mode = "0";
    $scope.pairedLight = null;
    $scope.available = typeof web3 !== 'undefined';
    $scope.account = null;

    var getLightLocation = function(trlContract) {
        trlContract.location(function(error, result) {
            if (error) {
                console.log(error);
            } else {
                $scope.lightLocations.push([parseFloat(result[0]), parseFloat(result[1])]);
                $scope.$apply();
            }
        });
    };

    var getLights = function(govContract) {
        govContract.getLights(function(error, result) {
            if (error) {
                console.log(error);
            } else {
                for (let addr of result) {
                    let trlContract = web3.eth.contract($scope.abis.trafficlight).at(addr);
                    getLightLocation(trlContract);
                }
                $scope.lightList = result;
            }
        });
    }
    
    var getContract = function() {
        $http.get('/contracts', {}).then(function(contracts) {
            if (contracts) {
                $scope.govContract = web3.eth.contract(contracts.data.government.abi).at(contracts.data.government.addr);
                $scope.abis = {
                    trafficlight: contracts.data.trafficlight.abi,
                    government: contracts.data.government.abi
                };
                getLights($scope.govContract);
            } else {
                $scope.available = false;
            }
        }, function(error) {
            $scope.available = false;
            console.log(error);
        });
    };

    var euclideanDist = function(loc1, loc2) {
        return Math.sqrt(Math.pow(loc1[0] - loc2[0], 2) + Math.pow(loc1[1] - loc2[1], 2));
    };

    var getNearestLight = function(loc) {
        var minDist = Number.MAX_VALUE;
        var nearLight = null;
        i = 0;
        for (let light of $scope.lightLocations) {
            let dist = euclideanDist(loc, light);
            if (dist < minDist) {
                minDist = dist;
                nearLight = $scope.lightList[i];
            }
            i++;
        }
        $scope.pairedLight = nearLight;
    };

    var account_locations = {
        "0x08206ddbe36e1ac88f76425e15267d8b881e36db":
        { 
            "longitude": { "value": 13.381815, "retrievalstatus": "VALID", "timestamp": 1543715406 },
            "latitude": { "value": 52.516506, "retrievalstatus": "VALID", "timestamp": 1543715406 },
            "heading": { "value": 52.520008, "retrievalstatus": "VALID", "timestamp": 1543715406 }
        },
        "0x00a6bde8fc7db03f78a8f405bf466ab8e2211375":
        { 
            "longitude": { "value": 15.381815, "retrievalstatus": "VALID", "timestamp": 1543715406 },
            "latitude": { "value": 52.516506, "retrievalstatus": "VALID", "timestamp": 1543715406 },
            "heading": { "value": 52.520008, "retrievalstatus": "VALID", "timestamp": 1543715406 }
        },
        "0x6b70658b2d554eabb4911af6a87b0da6037068c1":
        { 
            "longitude": { "value": 14.181815, "retrievalstatus": "VALID", "timestamp": 1543715406 },
            "latitude": { "value": 49.516506, "retrievalstatus": "VALID", "timestamp": 1543715406 },
            "heading": { "value": 52.520008, "retrievalstatus": "VALID", "timestamp": 1543715406 }
        },
    };
    
    var getLocation = function(next) {
        if ($scope.account != null) {
            let location = account_locations[$scope.account];
            $scope.location = [location.longitude.value, location.latitude.value];
            next($scope.location);
        } else {
            console.log("Account not found");
        }
        //$http.get('/getLocation', {}).then(function(location) {
        //    console.log(location);
        //    $scope.location = [location.data.longitude.value, location.data.latitude.value];
        //    next($scope.location);
        //}, function(error) {
        //    console.log(error);
        //});
    };

    var pairWithLight = function() {
        getLocation(getNearestLight);
    };

    modeAmounts = {
        "0": 0,
        "1": 0.01,
        "2": 0.03,
        "3": 0.09,
        "4": 0.65
    }

    $scope.bidLight = function() {
        if ($scope.pairedLight) {
            let lightContract = web3.eth.contract($scope.abis.trafficlight).at($scope.pairedLight);
            lightContract.bid.sendTransaction($scope.mode, {
                from: $scope.account,
                gas: 2000000,
                value: modeAmounts[$scope.mode]*10000000000000000,
                gasPrice: 10000000000
              }, function(error, result) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(result);
                }
            });
        } else {
            alert("Bidding is unavailable");
        }
    };

    var getAccount = function() {
        $scope.account = web3.eth.accounts[0];
        web3.eth.getBalance($scope.account, function(error, result) {
            if (error) {
                console.log(error);
            } else {
                $scope.balance = result*117/10000000000000000;
                $scope.$apply();
            }
        });
    };
    
    if ($scope.available) {
        web3 = new Web3(web3.currentProvider);
        getContract();
        $interval(getAccount, 100);
        $interval(pairWithLight, 200);
    } else {
        console.log('You should consider installing MetaMask or using a Web3 browser!');
    }
});