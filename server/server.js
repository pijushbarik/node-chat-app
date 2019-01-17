const path = require('path');
const express = require('express');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, '../public'))); // set static public directory

const server = require('http').createServer(app);

const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('new user connected');

  socket.on('createMessage', message => {
    message.createdAt = Date.now();

    console.log(message);

    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port);