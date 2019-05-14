var path = require('path');
var url = require('url');
var http = require('http');
var express = require('express');
var WebSocket = require('ws');

var app = express();
var server = http.createServer(app);
var port = 8004;

var public_dir = path.join(__dirname, 'ws_public');

app.use(express.static(public_dir));

var wss = new WebSocket.Server({server: server});
var clients = {};
var client_count = 0;
wss.on('connection', (ws) => {

    //gives the ip address and port number of the client
    var client_id = ws._socket.remoteAddress + ":" + ws._socket.remotePort;

    console.log('New connection: ' + client_id);
    clients[client_id] = ws;
    client_count++;
    ws.on('message', (message) => {
        console.log('Message from ' + client_id + ': ' + message);
   	var chat = {msg: 'text',data: message};
	Broadcast(JSON.stringify(chat));
    });
    ws.on('close', () => {
        console.log('Client disconnected: ' + client_id);
        delete clients[client_id];
	client_count--;
	UpdateClientCount();
    });
    UpdateClientCount();
});

function UpdateClientCount(){
    var id;
    var message = {msg:'client_count',data:client_count};
    //loops over every client and sends addclient
    //need to change to update client nummber for all users always
    Broadcast(JSON.stringify(message));
}


function Broadcast(message){
	var id;
	for(id in clients){
		if(clients.hasOwnProperty(id)){
			clients[id].send(message);
		}
	}

}


server.listen(port, '0.0.0.0');
console.log('Now listening on port ' + port);

