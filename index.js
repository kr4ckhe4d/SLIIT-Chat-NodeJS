var app = require('express')();
var express = require('express')
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = [];
var regUsers = [];
var chatRoomName;

const MongoClient = require('mongodb').MongoClient;

var db;
var collectionID;

app.use(express.static('public'));

MongoClient.connect('mongodb://root:root@ds155841.mlab.com:55841/sliit-chat-mtit', (err, database) => {
    if (err) return console.log(err)
    db = database

<<<<<<< HEAD
=======
    // Set the port of our application
>>>>>>> ac73c064a2b4fea4d254b6538e1d7ad46f2583d0
    /* 
     *process.env.PORT lets the port to be set dynamically depending
     *on the environmnent the server is hosted.
     */
    var port = process.env.PORT || 8080;
    http.listen(port, function() {
        console.log('listening on ' + port);
    });

    // http.listen(3000, function() {
    //     console.log('listening on *:3000');
    // });
})

<<<<<<< HEAD
/**
 * Routing to the root page.
 */
=======
>>>>>>> ac73c064a2b4fea4d254b6538e1d7ad46f2583d0
app.get('/', function(req, res) {
    console.log('GET /');
    res.sendFile(__dirname + '/index.html');
});

<<<<<<< HEAD
/**
 * This event will be called when a user lands on the root page of the chatroom.
 */
io.on('connection', function(socket) {
    console.log('a user connected');
=======
io.on('connection', function(socket) {
    console.log('a user connected');

>>>>>>> ac73c064a2b4fea4d254b6538e1d7ad46f2583d0
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

<<<<<<< HEAD
    /**
     * This event will be fired when a user tries to connect to a chat room.
     * If the user is a new user. This function will send a default message to the new user.
     */
=======
>>>>>>> ac73c064a2b4fea4d254b6538e1d7ad46f2583d0
    socket.on('register', function(msg, response) {
        if (clients.indexOf(socket.id) == -1) {
            clients.push(socket.id);
            regUsers.push({ 'name': msg.name, 'id': socket.id });
            console.log('Registered ' + msg.name);
            chatRoomName = msg.chatRoomName;
            response('success');
            io.to(socket.id).emit('chat message', {
                'message': 'Welcome to SLIIT chat ' + msg.name +
                    '. You have joined chatroom ' + msg.chatRoomName,
                'from': 'SLIIT Bot',
                'timestamp': ' '
            });
        }
    });

<<<<<<< HEAD
    /**
     * This event will be fired after a user successfully joins a chatroom.
     * If a chat history exists in the chat room, retrieve the history and send to the frontend.
     */
=======
    //'retrieve history'
>>>>>>> ac73c064a2b4fea4d254b6538e1d7ad46f2583d0
    socket.on('retrieve history', function(msg) {
        console.log('retrieve history by: ' + msg.from);
        db.collection(chatRoomName).find().toArray(function(err, results) {
            console.log(results)
            io.to(socket.id).emit('chat history', results);
        })
    });

<<<<<<< HEAD
    /**
     * This event will be fired when a user tries to join or create a chatroom.
     * Checks if a chatroom exists.
     */
=======
    //'check availability'
>>>>>>> ac73c064a2b4fea4d254b6538e1d7ad46f2583d0
    socket.on('check availability', function(msg, response) {
        console.log('join chatroom: ' + msg.from);
        db.collection(msg.chatRoomName).find().toArray(function(err, results) {
            console.log('availability: ' + results)
            if (results.length == 0) {
                response('error', results);
            } else {
                response('success', results);
            }
        })
    });

<<<<<<< HEAD
    /**
     * This event will be called whenever a user enters a message and a chat is emmitted.
     */
=======
>>>>>>> ac73c064a2b4fea4d254b6538e1d7ad46f2583d0
    socket.on('chat message', function(msg) {
        db.collection(chatRoomName).save(msg, (err, result) => {
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
    });
});