var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
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
    console.log(req.body);
    console.log(req.body.code);
    return "YOHO";
});

var server = app.listen(process.env.PORT | 9000, function() {
    console.log("App started at http://%s:%s", server.address().address, server.address().port)
});