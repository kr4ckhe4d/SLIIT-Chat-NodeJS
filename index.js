var app = require('express')();
var express = require('express')
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = [];
var regUsers = [];

app.use(express.static('public'));

app.get('/', function(req, res) {
    console.log('GET /');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');

    // if (clients.indexOf(socket.id) == -1) {
    //     clients.push(socket.id);
    // }

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('register', function(msg) {
        if (clients.indexOf(socket.id) == -1) {
            clients.push(socket.id);
            regUsers.push({ 'name': msg.name, 'id': socket.id });
            console.log('Registered ' + msg.name);
            io.to(socket.id).emit('chat message', { 'message': 'Welcome to SLIIT chat ' + msg.name, 'from': 'SLIIT Bot' });
        }
    });

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg.message);
        var username = '';
        for (var i = 0; i < regUsers.length; i++) {
            if (regUsers[i].id == socket.id) {
                username = regUsers[i].name;
                console.log('username found');
            }
        }

        console.log('emmitting from: ' + username);
        io.emit('chat message', { 'message': msg.message, 'from': username });

        console.log('No of clients: ' + clients.length);
        console.log('Clients: ' + clients);


        // for (var i = 0; i < clients.length; i++) {
        //     io.to(clients[i]).emit('chat message', i);
        // }
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});