// api/socket.js

const { Server } = require('socket.io');

const users = {};

module.exports = (req, res) => {
 if (!res.socket.server.io) {
  console.log('Setting up socket.io server...');
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

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
 }
 res.end();
};
