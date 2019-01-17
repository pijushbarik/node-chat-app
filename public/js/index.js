var socket = io();

socket.on('connect', function ()  {
  console.log('connected to the server');

  socket.on('newMessage', function (message) {
    console.log(message);
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
  });

  socket.on('newUser', function (message) {
    console.log(message);
    var newUser = $('<h4></h4>');
    newUser.text(message.text);
    $('#messages').append(newUser);
  });
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'user',
    text: $('#new-message').val()
  }, function (response) {
    console.log('received your message');
    $('#new-message').val('');
  });
});