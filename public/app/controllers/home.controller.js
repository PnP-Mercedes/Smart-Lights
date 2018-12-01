var app = angular.module("smartlight", []);

app.controller('homeController', function($scope, $http) {
    console.log("HELLO WORLD!");
    console.log(web3);
    $scope.available = typeof web3 !== 'undefined';

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('You should consider installing MetaMask or using a Web3 browser!');
    }

    
});