const express = require('express');
const app = express()




const websocketServerPort = process.env.PORT || 8000;
const websocketServer = require('websocket').server;
const http = require('http')
app.use(express.static(__dirname + '../../build'))

// Spinning the http server and the websocket server
const server = http.createServer();
server.listen(websocketServerPort);
console.log('listening on port 8000');

const wsServer = new websocketServer({
    httpServer : server
});

const clients = {};

//this code generates unique userid for everyuser
const getUniqueID = () =>{
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
return s4() + s4() + '-' + s4();
}

wsServer.on('request', function (request){
var userId = getUniqueID();
console.log((new Date()) + 'Receive ' + request.origin + '.');

// to accept only the req from allowed origin
const connection = request.accept(null, request.origin);
clients[userId] = connection;
console.log("connect: " + userId);


connection.on('message', function(message){
    if(message.type === 'utf8'){
        console.log('Received msg:', message.utf8Data);

        //broadcasting msg to all connect clients
        for (key in clients){
            clients[key].sendUTF(message.utf8Data);
            console.log('send msg to ', clients[key]);
        }
    }
})
})
