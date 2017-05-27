$(function() {
    var socket = io();
    console.log(socket);
    $('#form').submit(function() {
        $('#chat').append('<li class="self">' +
            '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
            '<div class="msg">' +
            '<p>Hola!</p>' +
            '<p>' + $('#m').val() +
            '</p>' +
            '<time>20:17</time>' +
            ' </div>' +
            '</li>');
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#chat').append('<li class="other">' +
            '<div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false" /></div>' +
            '<div class="msg">' +
            '<p>Hola!</p>' +
            '<p>' + msg +
            '</p>' +
            '<time>20:17</time>' +
            ' </div>' +
            '</li>');
    });
});