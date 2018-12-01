var app = angular.module("smartlight", []);

app.controller('homeController', function($scope, $http) {
    $scope.getNetworkName = function() {
        if ($scope.networkId == 1) return 'Main metwork';
        else if ($scope.networkId == 2) return 'deprecated Morden test network';
        else if ($scope.networkId == 3) return 'Ropsten test network';
        else if ($scope.networkId == 4) return 'Rinkeby test network';
        else if ($scope.networkId == 42) return 'Kovan test network';
        else return 'Local network';
    };

    $scope.getContract = function() {
        $http.get('/contract', {}).then(function(contract) {
            if (contract) {
                $scope.contract = web3.eth.contract(contract.data.abi).at(contract.data.addr);
                $scope.contract.getLights(function(error, result) {
                    if (error) {
                        console.log(error);
                    } else {
                        $scope.lightList = result;
                    }
                });
            } else {
                $scope.available = false;
            }
        }, function(error) {
            $scope.available = false;
            console.log(error);
        });
    };

    $scope.available = typeof web3 !== 'undefined';
    if ($scope.available) {
        web3 = new Web3(web3.currentProvider);
        $scope.getContract();
    } else {
        console.log('You should consider installing MetaMask or using a Web3 browser!');
    }
});