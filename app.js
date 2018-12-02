var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
require('dotenv').config();

var govContract = {
    abi: undefined,
    addr: undefined
};
var trlContract = {
    abi: undefined
};

fs.readFile('./contracts/Government.json', 'utf8', function(err, data) {
    if (err) {
        throw err;
    }
    let contractObject = JSON.parse(data);
    govContract.abi = contractObject.abi;
    govContract.addr = contractObject.address;
});

fs.readFile('./contracts/TrafficLight.json', 'utf8', function(err, data) {
    if (err) {
        throw err;
    }
    let contractObject = JSON.parse(data);
    trlContract.abi = contractObject.abi;
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));

app.get('/contracts', function(req, res) {
    return res.json({
        'government': govContract,
        'trafficlight': trlContract,
    });
});

app.get('/getCode', function(req, res) {
    return req.body.code;
});

app.get('/getLocation', function(req, res) {
    var responseString = "";
    var locReq = http.request({        
        hostname: 'https://api.mercedes-benz.com',
        port: 443,
        path: '/experimental/connectedvehicle/v1/vehicles/65E345ACD47C75AC45/location',
        method: 'POST',
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer 0b6fb484-7fd9-4b6a-8a5e-22a94d919b6b"          
       }
    }, function (locRes) {
        locRes.on("data", function (data) {
            responseString += data;
        });
        locRes.on("end", function () {
            console.log(responseString); 
        });
    });

    return responseString;
});

var server = app.listen(process.env.PORT | 9000, function() {
    console.log("App started at http://%s:%s", server.address().address, server.address().port)
});