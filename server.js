var express = require('express');
var app = express();
var _staticPath = __dirname + "/static/html/";
app.use(express.static('static'));
app.get('/', function (req, res) {
   res.sendFile( _staticPath + "index.html" );
});

var server = app.listen(8081, function () {
   console.log("App listening at http://localhost:8081")
});

