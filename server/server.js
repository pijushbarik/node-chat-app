const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');  // path to the public directory

const app = express();

app.use(express.static(publicPath)); // set static public directory

var server = app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});

const io = socketIO.listen(server); // bind socket.io to the server

io.on('connection', socket => {
  console.log('new user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});