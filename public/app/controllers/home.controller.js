var app = angular.module("smartlight", []);

app.controller('homeController', function($scope, $http, $interval) {
    $scope.lightList = [];
    $scope.lightLocations = [];
    $scope.mode = "0";
    $scope.pairedLight = null;
    $scope.available = typeof web3 !== 'undefined';

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

    var getLocation = function(next) {
        let location = {
            "longitude": {
                "value": 13.381815,
                "retrievalstatus": "VALID",
                "timestamp": 1543715406
            },
            "latitude": {
                "value": 52.516506,
                "retrievalstatus": "VALID",
                "timestamp": 1543715406
            },
            "heading": {
                "value": 52.520008,
                "retrievalstatus": "VALID",
                "timestamp": 1543715406
            }
        };
        $scope.location = [location.longitude.value, location.latitude.value];
        next($scope.location);
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

    $scope.bidLight = function() {
        if ($scope.pairedLight) {
            let lightContract = web3.eth.contract($scope.abis.trafficlight).at($scope.pairedLight);
            lightContract.bid($scope.mode, function(error, result) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(result);
                }
            });
        } else {
            alert("NO");
        }
    };

    $interval(pairWithLight, 200);

    if ($scope.available) {
        web3 = new Web3(web3.currentProvider);
        getContract();
    } else {
        console.log('You should consider installing MetaMask or using a Web3 browser!');
    }
});