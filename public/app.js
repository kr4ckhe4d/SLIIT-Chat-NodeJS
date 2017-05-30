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

    //joinChatRoom
    $('#joinChatRoom').click(function() {
        username = $('#userName').val();
        chatRoomName = $('#chatRoomName').val();
        if (username != '' && chatRoomName != '') {
            socket.emit('check availability', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName }, function(status, response) {
                console.log(JSON.stringify('Status: ' + status));
                console.log(JSON.stringify('Response: ' + response));
                if (status == 'error') {
                    alert("Could not find a chatroom by the name " + chatRoomName);
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

    //createChatRoom
    $('#createChatRoom').click(function() {
        username = $('#userName').val();
        chatRoomName = $('#chatRoomName').val();
        if (username != '' && chatRoomName != '') {
            socket.emit('check availability', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName }, function(status, response) {
                console.log(JSON.stringify('Status: ' + status));
                console.log(JSON.stringify('Response: ' + response));
                if (status == 'error') {
                    socket.emit('register', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName }, function(error) {
                        if (error == 'success') {
                            alert('New chatroom created.');
                            // socket.emit('retrieve history', { 'from': username });
                            $('#myModal').modal('toggle');
                            $(".name").html('SLIIT Chat - ' + chatRoomName);
                        }
                    });
                } else if (status == 'success') {
                    alert(chatRoomName + " already exists.");
                }
            });
        } else {
            alert('Username and Chatroom Name Cannot be empty');
        }
        // $('#myModal').modal('toggle');
    });

    $('#saveUsername').click(function() {
        username = $('#userName').val();
        socket.emit('register', { 'name': $('#userName').val(), 'chatRoomName': chatRoomName });
        $('#myModal').modal('toggle');
    });

    $('#form').submit(function() {
        $('#chat').append('<li class="self">' +
            '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
            '<div class="msg">' +
            '<p>Me:</p>' +
            '<p>' + $('#m').val() +
            '</p>' +
            '<time>20:17</time>' +
            ' </div>' +
            '</li>');
        socket.emit('chat message', { 'message': $('#m').val(), 'from': username });
        $('#m').val('');
        return false;
    });

    //'chat history'
    socket.on('chat history', function(msg) {
        console.log('history object: ' + JSON.stringify(msg));
        if (msg.length == 0) { return; }
        for (var i = msg.length - 1; i > -1; i--) {
            if (msg[i].from == username) {
                $('#chat').prepend('<li class="self">' +
                    '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
                    '<div class="msg">' +
                    '<p>Me:</p>' +
                    '<p>' + msg[i].message +
                    '</p>' +
                    '<time>20:17</time>' +
                    ' </div>' +
                    '</li>');
            } else {
                $('#chat').prepend('<li class="other">' +
                    '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
                    '<div class="msg">' +
                    '<p>' + msg[i].from + ':</p>' +
                    '<p>' + msg[i].message +
                    '</p>' +
                    '<time>20:17</time>' +
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
                '<p>' + msg.from + ':</p>' +
                '<p>' + msg.message +
                '</p>' +
                '<time>20:17</time>' +
                ' </div>' +
                '</li>');
        }
    });
});