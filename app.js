var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));

app.get('/contract', function(req, res) {
    return res.json(contract);
});

var server = app.listen(process.env.PORT | 9000, function() {
    console.log("App started at http://%s:%s", server.address().address, server.address().port)
});