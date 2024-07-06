// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

io.on('connection', (socket) => {
 console.log('A user connected: ' + socket.id);

 socket.on('updatePosition', (data) => {
  users[socket.id] = data;
  io.emit('positions', users);
 });

 socket.on('disconnect', () => {
  delete users[socket.id];
  io.emit('positions', users);
  console.log('A user disconnected: ' + socket.id);
 });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
