var socket = io();

socket.on('connect', function ()  {
  console.log('connected to the server');

  socket.on('newMessage', function (message) {
    console.log(message);
  });

  socket.on('newUser', function (message) {
    console.log(message);
  });
});