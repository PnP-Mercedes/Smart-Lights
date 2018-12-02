var app = angular.module("smartlight", []);

app.controller('homeController', function($scope, $http) {
    $scope.lightList = [];
    $scope.mode = "0";
    $scope.available = typeof web3 !== 'undefined';

    $scope.getLightLocation = function(trlContract) {
        trlContract.location(function(error, result) {
            if (error) {
                console.log(error);
            } else {
                $scope.lightList.push(result[0] + " " + result[1]);
                $scope.$apply();
            }
        });
    };

    $scope.getLights = function(contracts, govContract) {
        govContract.getLights(function(error, result) {
            if (error) {
                console.log(error);
            } else {
                for (let addr of result) {
                    let trlContract = web3.eth.contract(contracts.data.trafficlight.abi).at(addr);
                    $scope.getLightLocation(trlContract);
                }
            }
        });
    }
    
    $scope.getContract = function() {
        $http.get('/contracts', {}).then(function(contracts) {
            if (contracts) {
                $scope.govContract = web3.eth.contract(contracts.data.government.abi).at(contracts.data.government.addr);
                $scope.getLights(contracts, $scope.govContract);
            } else {
                $scope.available = false;
            }
        }, function(error) {
            $scope.available = false;
            console.log(error);
        });
    };

    $scope.bidLight = function() {
        console.log($scope.mode);
    };

    if ($scope.available) {
        web3 = new Web3(web3.currentProvider);
        $scope.getContract();
    } else {
        console.log('You should consider installing MetaMask or using a Web3 browser!');
    }
});