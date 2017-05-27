var app = require('express')();
var express = require('express')
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = [];
app.use(express.static('public'));

app.get('/', function(req, res) {
    console.log('GET /');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    io.to(socket.id).emit('chat message', 'Welcome to SLIIT chat');

    if (clients.indexOf(socket.id) == -1) {
        clients.push(socket.id);

    }

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', 'hello');

        console.log('No of clients: ' + clients.length);
        console.log('Clients: ' + clients);


        for (var i = 0; i < clients.length; i++) {
            io.to(clients[i]).emit('chat message', i);
        }
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});