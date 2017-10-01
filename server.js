const WebSocket = require('ws');
var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var http = require('http');
const uuidv1 = require('uuid/v1');

var app = express();
var port = process.env.PORT || 5000;
app.set('port', port);
var server = http.createServer(app);
var serverOnPort = server.listen(port);

var rooms = [];

app.use(express.static(path.join(__dirname, '/public')));
var _staticPath = __dirname + "/public/";

var wss = new WebSocketServer({ server: server });
wss.on('connection', function (ws) {
   ws.send('hello client!');
   console.log('started client connection');
   ws.on('close', function () {
      console.log('stopping client connection');
   });
   ws.on('message', function (msg) {
      console.log(msg);
      console.log('got a draw msg!');
      if(wss.clients) {
         wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
               console.log('sending msg');
               client.send(msg);
            }
         });
      }
   });

});

server.on('request', app);
server.listen(app.get('port'), function() {
   console.log("Node app is running at localhost:" + app.get('port'))
});


app.get('/drawingroom', function (req, res) {
   console.log('get / request');
   var newRoom = uuidv1();
   if(!rooms[newRoom]) {
      rooms.push(newRoom);
      res.redirect('/drawingroom/' + newRoom);
   } else {
      res.redirect('/');
   }
});
app.get('/drawingroom/:roomId', function (req, res) {
   console.log(req.params);
   if (req.params.roomId === 'room.js' ||
       req.params.roomId === 'my_ws.js' ||
       req.params.roomId === 'drawingboard.js') {
      res.sendFile( _staticPath + req.params.roomId );
   } else {
      console.log('get /* request');
      res.sendFile( _staticPath + "drawingroom.html" );
   }
});

