$(function() {
    var socket = io();
    console.log(socket);
    $('form').submit(function() {
        $('#messages').append($('<li>').text($('#m').val()));
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg));
    });
});