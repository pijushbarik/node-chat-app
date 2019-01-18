const path = require('path');
const express = require('express');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const users = new Users();

io.on('connection', socket => {
  console.log('new user connected'); 

  socket.on('join', (params, cb) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return cb('name and room name are required');
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} has joined the room`));

    return cb();
  });

  socket.on('createMessage', (message, cb) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    cb('this is from server');
  });

  socket.on('createLocationMessage', data => {
    io.emit('newLocationMessage', generateLocationMessage(data.from, data.coords));
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('admin', `${user.name} has left the room`));
    }
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});