const path = require('path');
const express = require('express');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, '../public'))); // set static public directory

const server = require('http').createServer(app);

const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('new user connected');

  socket.emit('newMessage', generateMessage('admin', 'welcome to the chat app'));

  socket.broadcast.emit('newUser', generateMessage('admin', 'a new user joined')); 

  socket.on('createMessage', (message, cb) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    cb('this is from server');
  });

  socket.on('createLocationMessage', data => {
    io.emit('newLocationMessage', generateLocationMessage(data.from, data.coords));
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});