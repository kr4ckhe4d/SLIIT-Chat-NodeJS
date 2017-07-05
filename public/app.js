$(function() {
    var socket = io();
    var username = '';
    var chatRoomName = '';
    console.log(socket);
    $('#myModal').modal('toggle');

    //btnChatHistory
    $('#btnChatHistory').click(function() {
        socket.emit('retrieve history', { 'from': username });
    });

    // Join an already existing chatroom.
    $('#joinChatRoom').click(function() {
        username = $('#userName').val();
        chatRoomName = $('#chatRoomName').val();
        // Form Validation pass
        if (username != '' && chatRoomName != '') {
            // Check if the entered Chatroom is available
            socket.emit('check availability', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName }, function(status, response) {
                console.log(JSON.stringify('Status: ' + status));
                console.log(JSON.stringify('Response: ' + response));
                // Chatroom does not exist.
                if (status == 'error') {
                    alert("Could not find a chatroom by the name " + chatRoomName);
                    // Chatroom exists. Therefore register user and retrieve history.
                } else {
                    socket.emit('register', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName }, function(error) {
                        if (error == 'success') {
                            socket.emit('retrieve history', { 'from': username });
                            $('#myModal').modal('toggle');
                            $(".name").html('SLIIT Chat - ' + chatRoomName);
                        }
                    });
                }
            });
        } else {
            alert('Username and Chatroom Name Cannot be empty');
        }
    });

    //Create New Chatroom Click Event
    $('#createChatRoom').click(function() {
        username = $('#userName').val();
        chatRoomName = $('#chatRoomName').val();
        // Sanity Check
        if (username != '' && chatRoomName != '') {
            // Check if the entered Chatroom name already exists
            socket.emit('check availability', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName }, function(status, response) {
                console.log(JSON.stringify('Status: ' + status));
                console.log(JSON.stringify('Response: ' + response));
                // Chatroom does not exist. Therefore create new one.
                if (status == 'error') {
                    socket.emit('register', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName }, function(error) {
                        if (error == 'success') {
                            alert('New chatroom created.');
                            $('#myModal').modal('toggle');
                            $(".name").html('SLIIT Chat - ' + chatRoomName);
                        }
                    });
                    // Chatroom already exists.
                } else if (status == 'success') {
                    alert(chatRoomName + " already exists.");
                }
            });
            // Sanity Check Failed.
        } else {
            alert('Username and Chatroom Name Cannot be empty');
        }
    });

    $('#saveUsername').click(function() {
        username = $('#userName').val();
        socket.emit('register', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName });
        $('#myModal').modal('toggle');
    });

    $('#form').submit(function() {
        var currentTime = new Date(new Date().getTime()).toLocaleString();
        $('#chat').append('<li class="self">' +
            '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
            '<div class="msg">' +
            '<p><b>Me:</b></p>' +
            '<p>' + $('#m').val() +
            '</p>' +
            '<time>' + currentTime + '</time>' +
            ' </div>' +
            '</li>');
        socket.emit('chat message', { 'message': $('#m').val(), 'from': username, 'timestamp': currentTime });
        $('#m').val('');
        return false;
    });

    // Successfully retrieved chat history
    socket.on('chat history', function(msg) {
        console.log('history object: ' + JSON.stringify(msg));
        // If chat object is empty, do nothing.
        if (msg.length == 0) { return; }
        for (var i = msg.length - 1; i > -1; i--) {
            // Check if the chat message was sent by this user.
            if (msg[i].from == username) {
                $('#chat').prepend('<li class="self">' +
                    '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
                    '<div class="msg">' +
                    '<p><b>Me:</b></p>' +
                    '<p>' + msg[i].message +
                    '</p>' +
                    '<time>' + msg[i].timestamp + '</time>' +
                    ' </div>' +
                    '</li>');
            } else {
                $('#chat').prepend('<li class="other">' +
                    '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
                    '<div class="msg">' +
                    '<p><b>' + msg[i].from + ':</b></p>' +
                    '<p>' + msg[i].message +
                    '</p>' +
                    '<time>' + msg[i].timestamp + '</time>' +
                    ' </div>' +
                    '</li>');
            }
        }
    });

    socket.on('chat message', function(msg) {
        console.log('msg: ' + JSON.stringify(msg));
        if (msg.from != username) {
            $('#chat').append('<li class="other">' +
                '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
                '<div class="msg">' +
                '<p><b>' + msg.from + ':</b></p>' +
                '<p>' + msg.message +
                '</p>' +
                '<time>' + msg.timestamp + '</time>' +
                ' </div>' +
                '</li>');
        }
    });
});