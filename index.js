var app = require('express')();
var express = require('express')
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = [];
var regUsers = [];

const MongoClient = require('mongodb').MongoClient;

var db;
var collectionID;

app.use(express.static('public'));

MongoClient.connect('mongodb://root:root@ds155841.mlab.com:55841/sliit-chat-mtit', (err, database) => {
    if (err) return console.log(err)
    db = database
    http.listen(3000, function() {
        console.log('listening on *:3000');
    });
})

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

    //'retrieve history'
    socket.on('retrieve history', function(msg) {
        console.log('retrieve history by: ' + msg.from);
        db.collection('chat').find().toArray(function(err, results) {
            console.log(results)
            io.to(socket.id).emit('chat history', results);
        })
    });

    socket.on('chat message', function(msg) {
        db.collection('chat').save(msg, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
        })

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