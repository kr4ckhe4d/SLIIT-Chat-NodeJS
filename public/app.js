$(function() {
    var socket = io();
    var username = '';
    console.log(socket);
    $('#myModal').modal('toggle');

    //btnChatHistory
    $('#btnChatHistory').click(function() {
        socket.emit('retrieve history', { 'from': username });
    });

    $('#saveUsername').click(function() {
        username = $('#userName').val();
        socket.emit('register', { 'name': $('#userName').val() });
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