const path = require('path');
const express = require('express');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const srcPath = path.resolve('src');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.resolve('public')));

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const users = new Users();

app.get('/', (req, res) => {
  res.sendFile(srcPath + '/index.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(srcPath + '/chat.html');
});

io.on('connection', socket => {
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
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    cb('this is from server');
  });

  socket.on('createLocationMessage', data => {
    var user = users.getUser(socket.id);
    
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, data.coords));
    }
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