const WebSocket = require('ws');
var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
const uuidv1 = require('uuid/v1');
var server = require('http').createServer();

var app = express();
var rooms = [];

app.use(express.static(path.join(__dirname, '/public')));
var _staticPath = __dirname + "/public/";

var wss = new WebSocketServer({server: server});
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
server.listen(8080, function () {
   console.log('Listening on http://localhost:8080');
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
   if (req.params.roomId === 'room.js') {
      res.sendFile( _staticPath + "room.js" );
   } else {
      console.log('get /* request');
      res.sendFile( _staticPath + "drawingroom.html" );
   }
});

