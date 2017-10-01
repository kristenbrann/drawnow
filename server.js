const WebSocket = require('ws');
var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();

app.use(express.static(path.join(__dirname, '/public')));

var wss = new WebSocketServer({server: server});
// Broadcast to all.
wss.broadcast = function broadcast(data) {
   wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
         client.send(data);
      }
   });
};
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
